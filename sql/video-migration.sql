-- ============================================================================
-- Dead Miniatures — add video support to artworks
-- REVIEW BEFORE RUNNING. Run in Supabase → SQL Editor once approved.
--
-- Safe on existing data: the three new columns are nullable and every
-- existing artwork row is left exactly as-is (no default backfill needed —
-- NULL just means "no video").
-- ============================================================================

-- ---- artworks: nullable video columns --------------------------------------
alter table public.artworks
  add column if not exists video_url text,
  add column if not exists video_path text,
  add column if not exists video_mime_type text;

-- ---- storage bucket for uploaded artwork videos ----------------------------
-- Public read so the <video> element can play the URLs directly. Writes are
-- NOT open to anon/authenticated — they only happen via short-lived signed
-- upload tokens minted by the server-only /api/artworks/video-upload-url
-- route (service-role key, admin-gated), same model as the existing
-- artwork-images bucket in sql/admin.sql.
--
-- file_size_limit + allowed_mime_types are enforced by Storage itself, as a
-- backstop independent of our application code — a modified client cannot
-- upload an oversized or wrong-type file even if it lies to our API route.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artwork-videos',
  'artwork-videos',
  true,
  52428800, -- 50 MB, in bytes
  array['video/mp4', 'video/webm']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 52428800,
      allowed_mime_types = array['video/mp4', 'video/webm'];

-- Anyone may READ objects in this bucket (videos play on the public site)...
drop policy if exists "Public read artwork videos" on storage.objects;
create policy "Public read artwork videos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'artwork-videos');

-- ...but there is intentionally NO anon/authenticated INSERT/UPDATE/DELETE
-- policy — all writes go through the signed-upload-token flow above.

-- Done. The admin form at /admin can now attach an optional video per piece,
-- and /artwork/[id] will render it when present.
