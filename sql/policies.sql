-- Run in Supabase → SQL Editor.
-- Gallery is public, read-only. Enable RLS and allow anonymous SELECT only.

alter table public.artworks enable row level security;

drop policy if exists "Public read artworks" on public.artworks;

create policy "Public read artworks"
  on public.artworks
  for select
  to anon
  using (true);

-- Note: no insert/update/delete policy for anon — writes stay blocked.
-- Manage rows via the Supabase dashboard or a service-role key on the server.
