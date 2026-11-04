# Simberwood Cocker Spaniels

Responsive React and Vite website for Simberwood, deployed on Cloudflare Pages. Adoption applications and contact messages are written to Supabase PostgreSQL through Cloudflare Pages Functions.

## Run locally

```sh
npm install
npm run dev
```

The Supabase-backed forms require the Cloudflare Pages Functions runtime and the two server-side values in `.env`: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service role key in browser code or a `VITE_` variable.

## Set up Supabase

1. Create a Supabase project.
2. Open **SQL Editor → New query**.
3. Open `supabase/schema.sql` from this repository, copy the full file into the SQL Editor, and click **Run** once.
4. In Supabase **Project Settings → API**, copy the **Project URL** and the **service_role** key. Keep the service role key secret.

## Deploy to Cloudflare Pages

1. Connect the GitHub repository `ngohjuniormbah/simberwood` to the Cloudflare Pages project named `simberwood`.
2. Set build command to `npm run build` and output directory to `dist`.
3. In **Pages → simberwood → Settings → Variables and Secrets**, add encrypted secrets named exactly `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Set them for Production (and Preview too if you use preview deployments).
4. Save, then trigger a new deployment from the **Deployments** tab.

The adoption and contact forms submit to `/api/applications` and `/api/contact`; Pages Functions write those rows to Supabase. The Functions return a success response only after Supabase accepts the insert.

## Data and admin

`supabase/schema.sql` creates tables for puppies, reviews, gallery items, adoption applications, contact messages, and social proof messages. Row Level Security is enabled, and the website's service role key remains server-side in Cloudflare.

The existing catalog editor, reviews, gallery, social proof settings, and admin inbox still use browser `localStorage`; those edits do not sync to Supabase yet. Adoption and contact form submissions are stored in Supabase but are not yet fetched into the admin inbox. Protect `/admin` with Cloudflare Access before using it with real customer data; the page itself does not authenticate administrators.

Supabase stores contact and adoption information. Restrict project access to trusted operators and apply a retention policy appropriate to your business.
