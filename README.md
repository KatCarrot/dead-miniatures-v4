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
| `/login`         | `app/login/page.tsx`          | Google sign-in for the admin.                                |
| `/admin`         | `app/admin/page.tsx`          | Manage pieces — admin home. Guarded — allowlisted Google account only. |
| `/admin/add`     | `app/admin/add/page.tsx`      | Add-a-piece form. Guarded — allowlisted Google account only. |

Logo + "Home" → `/`. Header **MINIATURES** → `/showcase`.

## File map

```
app/
  globals.css            theme tokens + design vars + hover helpers
  layout.tsx             fonts (next/font) + root html/body
  page.tsx               /
  showcase/page.tsx      /showcase
  artwork/[id]/page.tsx  /artwork/[id]
  login/page.tsx         /login  — Google sign-in (admin)
  admin/page.tsx         /admin  — manage pieces, admin home (guarded)
  admin/ManageList.tsx   the manage-pieces list UI (client)
  admin/add/page.tsx     /admin/add — new-artwork form (guarded)
  admin/add/AdminForm.tsx  the form UI (client)
  api/auth/[...nextauth]/route.ts   Auth.js handlers
  api/artworks/route.ts  POST — session-guarded insert (images/video already uploaded to Storage)
  api/artworks/upload-url/route.ts        POST — signed upload URL for cover/extra images
  api/artworks/video-upload-url/route.ts  POST — signed resumable (TUS) upload slot for video
  not-found.tsx          themed 404
auth.ts                  Auth.js config: Google + admin email allowlist
middleware.ts            protects /admin/*
components/
  SiteHeader.tsx         responsive nav (burger + MINIATURES dropdown)
  SiteFooter.tsx         footer bar
  HomeView.tsx           landing body: hero, showcase, quote, contacts
  GalleryView.tsx        showcase grid: tabs, deco figure, card carousels
  ProductView.tsx        product detail: media viewer, lightbox, prev/next
lib/
  supabaseClient.ts      anon read client (public site)
  supabaseAdmin.ts       service-role client (SERVER ONLY — admin writes)
  queries.ts             getLatestArtworks / getArtworks / getArtwork
  artworkBucket.ts       artwork-images bucket name (shared client/server)
  videoBucket.ts         artwork-videos bucket name + size/MIME limits (shared)
  tusUpload.ts           browser-side resumable (TUS) upload helper for video
config/
  categories.ts          category keys + labels (single source)
types/
  artwork.ts             Artwork type + Category union
sql/
  setup.sql              tables + seed + public-read RLS — run once
  admin.sql              storage bucket + policies for the admin panel
  policies.sql           RLS read policy on its own (if tables already exist)
  video-migration.sql    adds video_url/video_path/video_mime_type + the
                         artwork-videos bucket — review before running
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

## Admin panel (`/admin`)

A private form to add new pieces without touching Supabase directly. Photos
upload to Supabase Storage; a new row is inserted and appears live in the
showcase immediately.

### How access is locked down

- **Google sign-in** via Auth.js (NextAuth v5). No passwords to store. Any
  verified Google account can sign in — sign-in itself is never gated.
- **Allowlist** — admin *privileges* are checked separately, against the
  Google OIDC `sub` (stable account id, not email) in the `ADMIN_GOOGLE_SUBS`
  env var, and/or against a Google-**verified** email in `ADMIN_GOOGLE_EMAILS`
  (comma-separated; an account matching either list is an admin). These lists
  live in environment variables (`.env.local` locally, Vercel dashboard in
  prod) — **never in the committed source**. Read your own sub via
  `GET /api/whoami` after signing in.
- **`middleware.ts`** bounces any unauthenticated hit on `/admin/*` to
  `/login`; `/admin` and the write API route additionally re-check
  `isAdminSub` server-side.
- **Writes use the service-role key** only inside the server API route
  (`app/api/artworks/route.ts`), which re-checks the session. That key is
  server-only (no `NEXT_PUBLIC_` prefix) and never reaches the browser. The
  public site keeps using the read-only anon key.

### One-time setup

1. **Run `sql/admin.sql`** in the Supabase SQL editor — creates the public
   `artwork-images` storage bucket and its read policy.

2. **Google OAuth credentials** — Google Cloud Console → *APIs & Services* →
   *Credentials* → *Create OAuth client ID* → *Web application*:
   - Authorized JavaScript origins: `http://localhost:3000` and your prod URL
   - Authorized redirect URIs:
     `http://localhost:3000/api/auth/callback/google` and
     `https://YOUR-DOMAIN/api/auth/callback/google`
   - Copy the **Client ID** and **Client secret**.

3. **Fill `.env.local`** (already scaffolded — paste the missing values):

   ```
   SUPABASE_SERVICE_ROLE_KEY=   # Supabase → Settings → API → service_role
   AUTH_SECRET=                 # openssl rand -base64 33
   AUTH_GOOGLE_ID=              # from step 2
   AUTH_GOOGLE_SECRET=          # from step 2
   ADMIN_GOOGLE_SUBS=           # your Google "sub" — see step 4
   ```

   Add these same vars in **Vercel → Settings → Environment Variables** for prod.

4. **Sign in at `/login`** with any Google account, then hit `GET /api/whoami`
   to read your account's `sub`. Paste it into `ADMIN_GOOGLE_SUBS` (restart
   the dev server / redeploy), then go to `/admin/add` → fill the form →
   *Publish piece*. Add more admins later by extending `ADMIN_GOOGLE_SUBS`
   (comma-separated), no code change needed.

> Signing in never requires being on the allowlist. Accounts not in
> `ADMIN_GOOGLE_SUBS` can still authenticate but are redirected away from
> `/admin` and rejected by the write API.

### Video uploads

Each artwork can optionally have one video (MP4 or WebM, up to 50MB), shown
on `/artwork/[id]` as the first item in the media viewer, with the cover
image as its poster frame.

**Why it's a separate upload path from images:** images are small enough to
`PUT` in one shot to a signed Storage URL. Videos are not — they're uploaded
resumably over TUS (chunked, with progress, resilient to a dropped
connection), straight from the browser to Supabase Storage, using a
short-lived signed token from `POST /api/artworks/video-upload-url`. No
video bytes ever pass through a Next.js/Vercel function, so there's no
request-body size limit to hit no matter how big the file (short of the 50MB
cap, which is enforced independently in three places: the browser before
upload starts, the signed-URL route, and the Storage bucket's own
`file_size_limit`/`allowed_mime_types` — see `sql/video-migration.sql`).

**One-time setup:**

1. **Review, then run `sql/video-migration.sql`** in the Supabase SQL editor
   — adds the three nullable `video_*` columns to `artworks` and creates the
   public-read `artwork-videos` storage bucket (writes stay locked down to
   the signed-token flow, same model as `artwork-images`).
2. `npm install` — pulls in `tus-js-client`, used for the resumable upload.

No other config needed; the video field on `/admin` is optional, and
artworks without one render exactly as before.

