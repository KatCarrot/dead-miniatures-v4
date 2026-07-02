-- ============================================================================
-- Dead Miniatures — admin write access + image storage
-- Run this AFTER setup.sql, once, in Supabase → SQL Editor.
--
-- The public site reads with the anon key (RLS "select to anon").
-- The admin panel writes with the SERVICE ROLE key from a server-only API
-- route, which bypasses RLS — so we do NOT add an anon insert policy here
-- (that would let anyone write). Uploaded photos live in a public Storage
-- bucket so the gallery can display them.
-- ============================================================================

-- ---- storage bucket for uploaded artwork photos ----------------------------
-- Public read so <img>/background-image can load the URLs; writes happen only
-- through the service-role key on the server.
insert into storage.buckets (id, name, public)
values ('artwork-images', 'artwork-images', true)
on conflict (id) do update set public = true;

-- Anyone may READ objects in this bucket (public gallery images)...
drop policy if exists "Public read artwork images" on storage.objects;
create policy "Public read artwork images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'artwork-images');

-- ...but there is intentionally NO anon/authenticated INSERT policy.
-- The admin API uploads with the service-role key, which skips RLS entirely.

-- Done. The admin form at /admin can now upload photos and insert rows.
