# Dead Miniatures — Next.js + Supabase

Production code for the three routes. Drop these files into your Next.js (App
Router, Tailwind v4) project on Vercel.

## Routes

| Route            | File                          | Notes                                                        |
| ---------------- | ----------------------------- | ------------------------------------------------------------ |
| `/`              | `app/page.tsx`                | Landing. Server-fetches latest 6; tabs filter **client-side**. |
| `/showcase`      | `app/showcase/page.tsx`       | Gallery. Category from `?category=` filtered **server-side**. |
| `/artwork/[id]`  | `app/artwork/[id]/page.tsx`   | Product. Image switcher, meta, description.                  |

Logo + "Home" → `/`. Header **MINIATURES** → `/showcase`.

## File map

```
app/
  globals.css            theme tokens (Tailwind v4 @theme) — EDIT COLORS HERE
  layout.tsx             fonts (next/font) + root html/body
  page.tsx               /
  showcase/page.tsx      /showcase
  artwork/[id]/page.tsx  /artwork/[id]
components/
  TopNav.tsx             responsive nav (burger + MINIATURES dropdown)
  Hero.tsx               landing hero
  PaintedPiecesPreview.tsx  landing tabs (client-side filter) + View All Work
  AboutArtist.tsx        about block
  CategoryFilter.tsx     showcase tabs (URL links)
  ArtworkCard.tsx        gallery card
  ProductGallery.tsx     main image + thumbnail switcher
  StatusBadge.tsx        available / sold
lib/
  supabaseClient.ts      anon read client
  queries.ts             getLatestArtworks / getArtworks / getArtwork
  images.ts              [image_url, ...extra_images] -> dedupe
config/
  categories.ts          category keys + labels (single source)
types/
  artwork.ts             Artwork type + Category union
sql/
  policies.sql           RLS read policy
```

## Setup

1. **Install deps**

   ```bash
   npm install @supabase/supabase-js
   ```

2. **Env** — copy `.env.local.example` → `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

   Add the same two vars in Vercel → Project → Settings → Environment Variables.

3. **Path alias** — these files import via `@/…`. Ensure `tsconfig.json` has:

   ```json
   { "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./*"] } } }
   ```

   (If your code lives under `src/`, move these folders there and use `["./src/*"]`.)

4. **RLS** — run `sql/policies.sql` in the Supabase SQL editor (public read-only).

5. **Images** — `next.config.ts` allows `*.supabase.co/storage/...`. Tighten the
   host to your project ref. Brand images (`/public/logo.png`, `/public/hero.jpg`,
   `/public/artist.jpg`) are static — add your own.

## Theme

All colors and fonts live in `app/globals.css` under `@theme`. Change a value
there and it propagates through every component (utilities `bg-bg`, `text-cream`,
`text-accent`, `border-accent`, `font-display`, …). No `tailwind.config` needed.

## Data logic

- **Categories** — exact UPPERCASE match against the DB; `ALL` = no filter.
  Edit order/labels in `config/categories.ts` only.
- **Images** — `collectImages()` builds `[image_url, ...extra_images]`, drops
  empties, dedupes. Index 0 is the cover / default main image.
- **Latest preview** — `getLatestArtworks(6)` → `order('id', { ascending: false })`
  `.limit(6)`; landing tabs filter this set in the browser.
