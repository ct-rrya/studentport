-- optional supabase schema if you wanna persist cache in postgres instead of data/cache.json
create table if not exists public.ctu_portal_cache (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
