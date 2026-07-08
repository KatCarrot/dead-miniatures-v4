-- ============================================================================
-- Dead Miniatures — contact form submissions
-- Paste into Supabase → SQL Editor → Run.
-- Stores messages from the "/" contact form. No public read or write access —
-- everything happens server-side through the service-role client in
-- app/api/contact/route.ts, so RLS stays fully locked down (deny-by-default).
-- ============================================================================

create table if not exists public.contact_messages (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  email        text not null,
  message      text not null,
  consent_at   timestamptz not null  -- when the sender ticked the consent checkbox
);

alter table public.contact_messages enable row level security;
-- No policies are created: RLS with zero policies denies all access to the
-- anon/authenticated roles by default. Only the service-role key (used
-- exclusively in the POST /api/contact route handler) can read or write here.
