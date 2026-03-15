-- 1. Tambahkan kolom browser dan ubah traffic_type ke TEXT agar bisa simpan nama OS
ALTER TABLE conversions ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE conversions ALTER COLUMN traffic_type TYPE TEXT;

-- 2. Pastikan tabel daily_reports memiliki struktur yang benar
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS tracker_name TEXT;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_reports' AND column_name='clicks') THEN
        ALTER TABLE daily_reports ADD COLUMN clicks INT DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_reports' AND column_name='visits') THEN
        ALTER TABLE daily_reports ADD COLUMN visits INT DEFAULT 0;
    END IF;
END $$;

-- 3. Fungsi RPC untuk Real-time Click Tracking (Dipanggil Worker)
CREATE OR REPLACE FUNCTION increment_click_count(
    click_date DATE,
    click_smartlink TEXT,
    click_network TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO daily_reports (date, smartlink, network, clicks)
    VALUES (click_date, TRIM(click_smartlink), TRIM(click_network), 1)
    ON CONFLICT (date, smartlink, network)
    DO UPDATE SET 
        clicks = daily_reports.clicks + 1;
END;
$$ LANGUAGE plpgsql;

-- 3. Buat Fungsi RPC increment_daily_report
-- Fungsi ini memastikan lead dan payout ditambahkan secara atomik
CREATE OR REPLACE FUNCTION increment_daily_report(
    report_date DATE,
    report_smartlink TEXT,
    report_network TEXT,
    report_payout DECIMAL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO daily_reports (date, smartlink, network, leads, payout)
    VALUES (report_date, report_smartlink, report_network, 1, report_payout)
    ON CONFLICT (date, smartlink, network)
    DO UPDATE SET 
        leads = COALESCE(daily_reports.leads, 0) + 1,
        payout = COALESCE(daily_reports.payout, 0) + EXCLUDED.payout;
END;
$$ LANGUAGE plpgsql;
