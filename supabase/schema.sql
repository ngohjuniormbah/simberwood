-- Simberwood Supabase (PostgreSQL) schema
-- Paste this whole file into Supabase Dashboard → SQL Editor → New query → Run.
-- Cloudflare Pages Functions use a server-side service role key.
-- Row Level Security is enabled and no public policies are created.

create table if not exists public.puppies (
  id text primary key,
  name text not null,
  breed_type text not null default 'Cocker Spaniel',
  coat_color text not null,
  gender text not null check (gender in ('Male', 'Female')),
  age_weeks integer not null check (age_weeks >= 0),
  adoption_fee integer not null check (adoption_fee >= 0),
  primary_image text not null,
  additional_images_json jsonb not null default '[]'::jsonb,
  status text not null check (status in ('available', 'reserve', 'adopted', 'cancel')),
  headline text,
  temperament_json jsonb not null default '[]'::jsonb,
  description text,
  date_added date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists puppies_status_date on public.puppies(status, date_added desc);

create table if not exists public.reviews (
  id text primary key,
  author text not null,
  author_photo text not null default '',
  location text not null default '',
  rating integer not null check (rating between 1 and 5),
  title text not null,
  comment text not null,
  review_image text,
  review_link_url text,
  review_link_label text,
  date date not null default current_date,
  verified_adopter boolean not null default false
);

create table if not exists public.gallery_items (
  id text primary key,
  image_url text not null,
  picture_writeup text,
  caption_writeup text not null,
  date_added date not null default current_date
);

create table if not exists public.adoption_applications (
  id text primary key,
  submitted_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  residence_type text not null,
  own_or_rent text not null,
  pets_allowed text not null,
  fenced_yard text not null,
  adults text not null,
  children text not null,
  everyone_agrees text not null,
  owned_dog text not null,
  current_pets text not null default '',
  preferred_color text not null,
  preferred_sex text not null,
  vet_care text not null,
  custom_puppy_name text,
  selected_puppy_id text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'approved', 'rejected'))
);
create index if not exists applications_status_date on public.adoption_applications(status, submitted_at desc);
create index if not exists applications_email on public.adoption_applications(email);

create table if not exists public.contact_messages (
  id text primary key,
  submitted_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived'))
);
create index if not exists contact_status_date on public.contact_messages(status, submitted_at desc);

create table if not exists public.social_proof_messages (
  id text primary key,
  name text not null,
  location text not null default '',
  avatar text not null default '',
  action text not null,
  time_ago text not null default ''
);

alter table public.puppies enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery_items enable row level security;
alter table public.adoption_applications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.social_proof_messages enable row level security;

-- Homepage hero backgrounds are stored in Supabase Storage; slide metadata and
-- slideshow controls are stored in PostgreSQL.
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text not null unique,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists hero_slides_position on public.hero_slides(position, created_at);

create table if not exists public.hero_settings (
  id text primary key check (id = 'main'),
  slideshow_enabled boolean not null default true,
  interval_seconds integer not null default 5 check (interval_seconds between 3 and 30),
  updated_at timestamptz not null default now()
);
insert into public.hero_settings (id) values ('main') on conflict (id) do nothing;

alter table public.hero_slides enable row level security;
alter table public.hero_settings enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hero-backgrounds',
  'hero-backgrounds',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
