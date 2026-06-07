create table if not exists public.portfolio_state (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_settings (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_apps (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_widgets (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_reviews (
  id text primary key,
  status text not null default 'en attente',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_contact_messages (
  id text primary key,
  status text not null default 'non lu',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_appointments (
  id text primary key,
  status text not null default 'En attente',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_experiences (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_missions_projects (
  id text primary key,
  category text,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_education_timeline (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_hobbies (
  id text primary key,
  category text,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_blog_articles (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_media (
  id text primary key,
  owner_table text,
  owner_id text,
  media_type text,
  url text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.portfolio_state enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.portfolio_apps enable row level security;
alter table public.portfolio_widgets enable row level security;
alter table public.portfolio_reviews enable row level security;
alter table public.portfolio_contact_messages enable row level security;
alter table public.portfolio_appointments enable row level security;
alter table public.portfolio_experiences enable row level security;
alter table public.portfolio_missions_projects enable row level security;
alter table public.portfolio_education_timeline enable row level security;
alter table public.portfolio_hobbies enable row level security;
alter table public.portfolio_blog_articles enable row level security;
alter table public.portfolio_media enable row level security;

drop policy if exists "portfolio public read state" on public.portfolio_state;
create policy "portfolio public read state" on public.portfolio_state for select using (true);

drop policy if exists "portfolio public upsert state" on public.portfolio_state;
create policy "portfolio public upsert state" on public.portfolio_state for all using (true) with check (true);

drop policy if exists "portfolio public crud settings" on public.portfolio_settings;
create policy "portfolio public crud settings" on public.portfolio_settings for all using (true) with check (true);

drop policy if exists "portfolio public crud apps" on public.portfolio_apps;
create policy "portfolio public crud apps" on public.portfolio_apps for all using (true) with check (true);

drop policy if exists "portfolio public crud widgets" on public.portfolio_widgets;
create policy "portfolio public crud widgets" on public.portfolio_widgets for all using (true) with check (true);

drop policy if exists "portfolio public read reviews" on public.portfolio_reviews;
create policy "portfolio public read reviews" on public.portfolio_reviews for select using (true);

drop policy if exists "portfolio public write reviews" on public.portfolio_reviews;
create policy "portfolio public write reviews" on public.portfolio_reviews for all using (true) with check (true);

drop policy if exists "portfolio public write messages" on public.portfolio_contact_messages;
create policy "portfolio public write messages" on public.portfolio_contact_messages for all using (true) with check (true);

drop policy if exists "portfolio public write appointments" on public.portfolio_appointments;
create policy "portfolio public write appointments" on public.portfolio_appointments for all using (true) with check (true);

drop policy if exists "portfolio public crud experiences" on public.portfolio_experiences;
create policy "portfolio public crud experiences" on public.portfolio_experiences for all using (true) with check (true);

drop policy if exists "portfolio public crud missions" on public.portfolio_missions_projects;
create policy "portfolio public crud missions" on public.portfolio_missions_projects for all using (true) with check (true);

drop policy if exists "portfolio public crud education" on public.portfolio_education_timeline;
create policy "portfolio public crud education" on public.portfolio_education_timeline for all using (true) with check (true);

drop policy if exists "portfolio public crud hobbies" on public.portfolio_hobbies;
create policy "portfolio public crud hobbies" on public.portfolio_hobbies for all using (true) with check (true);

drop policy if exists "portfolio public crud articles" on public.portfolio_blog_articles;
create policy "portfolio public crud articles" on public.portfolio_blog_articles for all using (true) with check (true);

drop policy if exists "portfolio public crud media" on public.portfolio_media;
create policy "portfolio public crud media" on public.portfolio_media for all using (true) with check (true);
