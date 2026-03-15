-- ======================================================
-- REPAIR UNKNOWN LEADS V7 (ZERO TOLERANCE - CASE SENSITIVE)
-- ======================================================
-- Fokus: 
-- 1. Pulihkan nama Tracker asli (Hartoyo99, BUKAN HARTOYO99)
-- 2. Perbaiki leads UNKNOWN dengan Cross-Match Click ID & Slug
-- 3. Bersihkan data NULL di laporan daily
-- ======================================================

BEGIN;

-- 1. Pastikan kolom tracker_name ada di tabel clicks
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS tracker_name TEXT;

-- 2. Perbaiki tabel CLICKS: Ambil nama asli dari tabel TRACKER (Case-Sensitive)
--    Kita coba cocokin slug clicks dengan slug tracker, atau trackerId link.
UPDATE clicks c
SET tracker_name = t.name
FROM tracker t
WHERE (c.slug = t.slug OR c.s3 = t.slug) 
  AND (c.tracker_name IS NULL OR c.tracker_name = 'UNKNOWN' OR c.tracker_name = UPPER(t.name));

-- 3. Perbaiki tabel CONVERSIONS: Tarik data dari clicks yang sudah bener
UPDATE conversions conv
SET 
  sub_id = c.tracker_name,
  network = CASE 
    WHEN c.s3 IS NOT NULL AND c.s3 <> '' THEN c.s3 
    ELSE conv.network 
  END
FROM clicks c
WHERE conv.click_id = c.click_id
  AND (conv.sub_id = 'Unknown' OR conv.sub_id = 'UNKNOWN' OR conv.sub_id IS NULL OR conv.sub_id = UPPER(c.tracker_name));

-- 3.1 Bersihkan sisa-sisa UNKNOWN di conversions yang masih punya sub_id lama
--     Jika sub_id masih "Unknown" tapi click_id mengandung pattern tertentu, coba tebak (Opsional)

-- 4. RE-AGREGASI ULANG DAILY_REPORTS (REBUILD TOTAL)
--    Kita Hapus dulu karena kita mau hitungan yang bener-bener akurat (tanpa NULL)
TRUNCATE TABLE daily_reports RESTART IDENTITY;

-- 4.1 Masukkan data Klik (Hits)
INSERT INTO daily_reports (date, smartlink, network, clicks)
SELECT 
    date(created_at) as date,
    COALESCE(tracker_name, 'UNKNOWN') as smartlink,
    COALESCE(s3, 'UNKNOWN') as network,
    COUNT(*) as clicks
FROM clicks
GROUP BY 1, 2, 3
ON CONFLICT (date, smartlink, network)
DO UPDATE SET 
    clicks = EXCLUDED.clicks;

-- 4.2 Masukkan data Leads & Payout
--     Gunakan COALESCE agar tidak ada NULL
INSERT INTO daily_reports (date, smartlink, network, leads, payout)
SELECT 
    date(created_at) as date,
    COALESCE(sub_id, 'UNKNOWN') as smartlink,
    COALESCE(network, 'UNKNOWN') as network,
    COUNT(*) as leads,
    SUM(COALESCE(earning, 0)) as payout
FROM conversions
GROUP BY 1, 2, 3
ON CONFLICT (date, smartlink, network)
DO UPDATE SET 
    leads = EXCLUDED.leads,
    payout = EXCLUDED.payout;

-- 5. Final Touch: Pastikan tidak ada kolom leads/payout yang NULL
UPDATE daily_reports SET leads = 0 WHERE leads IS NULL;
UPDATE daily_reports SET payout = 0 WHERE payout IS NULL;
UPDATE daily_reports SET clicks = 0 WHERE clicks IS NULL;

COMMIT;

-- VERIFIKASI HASIL
SELECT * FROM daily_reports ORDER BY date DESC, leads DESC LIMIT 20;
