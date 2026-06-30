-- ============================================================================
-- Dead Miniatures — full database setup
-- Paste into Supabase → SQL Editor → Run.
-- Safe on a fresh project: drops & recreates the two tables, seeds data,
-- and enables public read-only access (RLS).
-- ============================================================================

-- ---- clean slate -----------------------------------------------------------
drop table if exists public.artworks cascade;
drop table if exists public.categories cascade;

-- ---- categories ------------------------------------------------------------
create table public.categories (
  name text primary key            -- stored strictly UPPERCASE
);

insert into public.categories (name) values
  ('BUSTS'),
  ('SINGLE'),
  ('SQUAD'),
  ('DIORAMA'),
  ('VEHICLE'),
  ('SMALL SCALE');

-- ---- artworks --------------------------------------------------------------
create table public.artworks (
  id           bigint generated always as identity primary key,
  name         text   not null,
  category     text   not null references public.categories(name),
  status       text   not null default 'available'
                 check (status in ('available', 'sold')),
  sculptor     text,
  scale        text,
  game_system  text,
  time_hours   bigint,
  description  text,
  image_url    text,
  extra_images text[] default '{}'
);

-- ---- seed: the 4 approved pieces -------------------------------------------
-- image paths point at /public/samples/*.png in the Next.js app.
-- Replace with your Supabase Storage URLs once you upload real photos.
insert into public.artworks
  (name, category, status, sculptor, scale, game_system, time_hours, description, image_url, extra_images)
values
  (
    'Crimson Ronin', 'SMALL SCALE', 'available',
    'Kisa', '32 mm', 'Bushido', 26,
    'A small-scale ronin painted in hand-mixed reds with cool teal cloth to push the silhouette. Object-source lighting on the blade, freehand wear across the armour plates.',
    '/samples/mini-1.png',
    array['/samples/mini-1.png', '/samples/mini-3.png', '/samples/mini-4.png']
  ),
  (
    'Axe Foreman', 'SINGLE', 'available',
    'Sergey Travianski', '75 mm', 'Malifaux', 40,
    'A single-figure commission painted entirely by hand. The piece leans on warm reds against a desaturated denim base to push the silhouette forward, with edge-light work on the axe and freehand wear across the jacket. Sealed matte, with selective gloss on metals.',
    '/samples/mini-2.png',
    array['/samples/mini-1.png', '/samples/mini-3.png', '/samples/mini-4.png']
  ),
  (
    'Blood Knight', 'SINGLE', 'sold',
    'Kisa', '54 mm', 'Kingdom Death', 38,
    'Blue-and-gold knight with a tattered crimson cloak. Layered NMM gold, marble basework, and a worn cape built up in glazes.',
    '/samples/mini-3.png',
    array['/samples/mini-3.png', '/samples/mini-1.png']
  ),
  (
    'Iron Column', 'VEHICLE', 'sold',
    'Kisa', '28 mm', 'Warhammer 40k', 52,
    'Battle-worn armour piece with heavy chipping, oil-streaked panels and pigment-built dust on the lower hull.',
    '/samples/mini-1.png',
    array['/samples/mini-1.png', '/samples/mini-2.png']
  );

-- ---- RLS: public read-only -------------------------------------------------
alter table public.categories enable row level security;
alter table public.artworks   enable row level security;

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
  on public.categories for select to anon using (true);

drop policy if exists "Public read artworks" on public.artworks;
create policy "Public read artworks"
  on public.artworks for select to anon using (true);

-- Done. /showcase and / will now show these 4 pieces.
