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
| `/`              | `app/page.tsx`                | Landing: hero, showcase tabs, quote/video, contacts.         |
| `/showcase`      | `app/showcase/page.tsx`       | Gallery. Client-fetches `artworks`; category tabs + deco art. |
| `/artwork/[id]`  | `app/artwork/[id]/page.tsx`   | Product. Media viewer, thumbnails, lightbox, prev/next.      |

Logo + "Home" → `/`. Header **MINIATURES** → `/showcase`.

## File map

```
app/
  globals.css            theme tokens + design vars + hover helpers
  layout.tsx             fonts (next/font) + root html/body
  page.tsx               /
  showcase/page.tsx      /showcase
  artwork/[id]/page.tsx  /artwork/[id]
  not-found.tsx          themed 404
components/
  SiteHeader.tsx         responsive nav (burger + MINIATURES dropdown)
  SiteFooter.tsx         footer bar
  HomeView.tsx           landing body: hero, showcase, quote, contacts
  GalleryView.tsx        showcase grid: tabs, deco figure, card carousels
  ProductView.tsx        product detail: media viewer, lightbox, prev/next
lib/
  supabaseClient.ts      anon read client
  queries.ts             getLatestArtworks / getArtworks / getArtwork
config/
  categories.ts          category keys + labels (single source)
types/
  artwork.ts             Artwork type + Category union
sql/
  setup.sql              full DB setup: tables + seed + RLS — run once
  policies.sql           RLS read policy on its own (if tables already exist)
public/
  brand/                 logo, hero/quote backgrounds, scratch textures
  icons/                 mail / instagram / youtube glyphs
  samples/               seed + deco artwork images
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

## Запуск локально (Rider / VS Code)

Нужен **Node.js 18.18+** (лучше 20 LTS) — https://nodejs.org.

**Способ 1 — двойной клик (Windows):**

- `start-local.bat` — создаёт `.env.local`, ставит зависимости (один раз),
  поднимает dev-сервер с hot-reload и открывает `http://localhost:3000`.
- `preview-prod.bat` — то же, но через прод-сборку (`build` + `start`) —
  ровно то, что уедет на Vercel.

**Способ 2 — Rider:** в файле `.run/` уже лежат готовые конфигурации запуска —
после открытия папки они появятся в выпадашке Run/Debug справа вверху:

- **dev (localhost:3000)** — разработка, hot-reload.
- **build (prod)** → затем **start (serve prod build)** — прод-предпросмотр.

Нажмите ▶ рядом с `dev` и откройте `http://localhost:3000`.

> Без `.env.local` с ключами Supabase приложение упадёт на старте
> (в `lib/supabaseClient.ts` стоит проверка переменных). `.bat`-скрипты создают
> файл из примера автоматически — останется вписать ключи.

## Theme

All colors and fonts live in `app/globals.css` under `@theme`. Change a value
there and it propagates through every component (utilities `bg-bg`, `text-cream`,
`text-accent`, `border-accent`, `font-display`, …). No `tailwind.config` needed.

## Data logic

- **Categories** — exact UPPERCASE match against the DB; `ALL` = no filter.
  Edit order/labels in `config/categories.ts` only.
- **Images** — stored paths are normalised (`public/x` → `/x`); index 0 is the
  cover. The gallery + product viewer build their image lists from
  `image_url` + `extra_images`.
- **Gallery** — `GalleryView` client-fetches the full `artworks` table and
  filters by the active category tab in the browser.
