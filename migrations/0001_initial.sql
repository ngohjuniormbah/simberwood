-- Simberwood Cloudflare D1 schema
-- Apply with: npx wrangler d1 execute simberwood-db --remote --file=migrations/0001_initial.sql

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS puppies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  breed_type TEXT NOT NULL DEFAULT 'Cocker Spaniel',
  coat_color TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  age_weeks INTEGER NOT NULL CHECK (age_weeks >= 0),
  adoption_fee INTEGER NOT NULL CHECK (adoption_fee >= 0),
  primary_image TEXT NOT NULL,
  additional_images_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL CHECK (status IN ('available', 'reserve', 'adopted', 'cancel')),
  headline TEXT,
  temperament_json TEXT NOT NULL DEFAULT '[]',
  description TEXT,
  date_added TEXT NOT NULL DEFAULT (date('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS puppies_status_date ON puppies(status, date_added DESC);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  author_photo TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  review_image TEXT,
  review_link_url TEXT,
  review_link_label TEXT,
  date TEXT NOT NULL DEFAULT (date('now')),
  verified_adopter INTEGER NOT NULL DEFAULT 0 CHECK (verified_adopter IN (0, 1))
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  picture_writeup TEXT,
  caption_writeup TEXT NOT NULL,
  date_added TEXT NOT NULL DEFAULT (date('now'))
);

CREATE TABLE IF NOT EXISTS adoption_applications (
  id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  residence_type TEXT NOT NULL,
  own_or_rent TEXT NOT NULL,
  pets_allowed TEXT NOT NULL,
  fenced_yard TEXT NOT NULL,
  adults TEXT NOT NULL,
  children TEXT NOT NULL,
  everyone_agrees TEXT NOT NULL,
  owned_dog TEXT NOT NULL,
  current_pets TEXT NOT NULL DEFAULT '',
  preferred_color TEXT NOT NULL,
  preferred_sex TEXT NOT NULL,
  vet_care TEXT NOT NULL,
  custom_puppy_name TEXT,
  -- Puppy inventory is currently supplied by the front-end seed data, so this
  -- remains an ID without a foreign key until catalog sync is enabled.
  selected_puppy_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected'))
);
CREATE INDEX IF NOT EXISTS applications_status_date ON adoption_applications(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS applications_email ON adoption_applications(email);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived'))
);
CREATE INDEX IF NOT EXISTS contact_status_date ON contact_messages(status, submitted_at DESC);

CREATE TABLE IF NOT EXISTS social_proof_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  time_ago TEXT NOT NULL DEFAULT ''
);
