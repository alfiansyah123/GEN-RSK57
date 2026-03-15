-- ======================================================
-- FIX PERMISSIONS & DISABLE RLS (EMERGENCY FIX)
-- ======================================================

BEGIN;

-- Disable RLS on all key tables to allow frontend direct access (Anon Key)
ALTER TABLE link DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaign DISABLE ROW LEVEL SECURITY;
ALTER TABLE domain DISABLE ROW LEVEL SECURITY;
ALTER TABLE tracker DISABLE ROW LEVEL SECURITY;
ALTER TABLE clicks DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversions DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to both anon and authenticated roles
GRANT ALL ON TABLE link TO anon, authenticated;
GRANT ALL ON TABLE campaign TO anon, authenticated;
GRANT ALL ON TABLE domain TO anon, authenticated;
GRANT ALL ON TABLE tracker TO anon, authenticated;
GRANT ALL ON TABLE clicks TO anon, authenticated;
GRANT ALL ON TABLE conversions TO anon, authenticated;
GRANT ALL ON TABLE daily_reports TO anon, authenticated;

-- Ensure sequences are also accessible
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;
