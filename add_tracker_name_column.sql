-- TAMBAHKAN KOLOM tracker_name KE TABEL clicks
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS tracker_name TEXT;
