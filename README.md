# Dead Miniatures — Next.js + Supabase

A complete, runnable Next.js (App Router, Tailwind v4) app for the three routes.
Clone, `npm install`, add Supabase env vars, and deploy to Vercel.

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase URL + anon key
npm run dev                         # http://localhost:3000
```

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
  setup.sql              full DB setup: tables + seed (4 pieces) + RLS — run once
  policies.sql           RLS read policy on its own (if tables already exist)
public/
  logo.png               header logo
  hero.jpg / artist.jpg  brand shots (PLACEHOLDERS — swap for real photos)
  samples/mini-*.png     seed artwork images (referenced by sql/setup.sql)
```

Project config (`package.json`, `tsconfig.json` with the `@/*` alias,
`eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`) is all included —
nothing extra to wire up. `app/not-found.tsx` renders a themed 404.

## Setup

1. **Install deps**

   ```bash
   npm install
   ```

2. **Env** — copy `.env.local.example` → `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

   Add the same two vars in Vercel → Project → Settings → Environment Variables.

3. **Database** — run `sql/setup.sql` in the Supabase SQL editor. It creates the
   `categories` + `artworks` tables, seeds 4 demo pieces, and enables public
   read-only RLS. (Use `sql/policies.sql` alone if your tables already exist.)

4. **Images** — `next.config.ts` allows `*.supabase.co/storage/...` for
   `next/image`; tighten the host to your project ref in production. Seed images
   live in `/public/samples`. `hero.jpg` and `artist.jpg` ship as placeholders —
   replace them with real studio photos.

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
