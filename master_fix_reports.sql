-- MASTER FIX FOR MISSING REPORTS
-- 1. Grant Permission to RPCs (Wajib!)
GRANT EXECUTE ON FUNCTION increment_click_count(DATE, TEXT, TEXT) TO public, anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_daily_report(DATE, TEXT, TEXT, DECIMAL) TO public, anon, authenticated;

-- 2. Add Unique Constraint for ON CONFLICT (Syarat wajib ON CONFLICT)
-- Kita hapus dulu kalau ada yang lama biar fresh
ALTER TABLE daily_reports DROP CONSTRAINT IF EXISTS daily_reports_unique_key;
ALTER TABLE daily_reports ADD CONSTRAINT daily_reports_unique_key UNIQUE (date, smartlink, network);

-- 3. Fix any existing NULLs that might break aggregation
UPDATE daily_reports SET clicks = 0 WHERE clicks IS NULL;
UPDATE daily_reports SET leads = 0 WHERE leads IS NULL;
UPDATE daily_reports SET payout = 0 WHERE payout IS NULL;

-- 4. Ensure RLS is OFF for aggregation tables during testing
ALTER TABLE daily_reports DISABLE ROW LEVEL SECURITY;
GRANT ALL ON daily_reports TO anon, authenticated, postgres, service_role;
