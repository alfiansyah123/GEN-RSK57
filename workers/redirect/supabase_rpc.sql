-- ============================================
-- RPC Function: increment_click_count
-- Digunakan oleh Cloudflare Worker untuk update clickCount
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor
-- ============================================

CREATE OR REPLACE FUNCTION increment_click_count(link_id INT)
RETURNS void AS $$
BEGIN
  UPDATE link SET "clickCount" = "clickCount" + 1 WHERE id = link_id;
END;
$$ LANGUAGE plpgsql;
