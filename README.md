# Simberwood Cocker Spaniels

Responsive React and Vite website for Simberwood, deployed on Cloudflare Pages. Adoption applications and contact messages are written to Supabase PostgreSQL through Cloudflare Pages Functions.

## Run locally

```sh
npm install
npm run dev
```

`npm run dev` starts the Vite front end. To run the Pages Functions locally, build the site and use the Cloudflare Pages runtime with `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in a local `.dev.vars` file.

Never expose the Supabase secret key in browser code, a `VITE_` variable, or source control. Supabase recommends sending new secret API keys in the `apikey` header only.

## Set up Supabase

1. Create a Supabase project.
2. Open **SQL Editor → New query**.
3. Open `supabase/schema.sql` from this repository, copy the full file into the SQL Editor, and click **Run** once.
4. In **Project Settings → API**, copy the **Project URL**.
5. In **Project Settings → API Keys**, copy a **secret** key (starts with `sb_secret_`). Keep it private.

## Deploy to Cloudflare Pages

1. Connect the GitHub repository `ngohjuniormbah/simberwood` to the Cloudflare Pages project named `simberwood`.
2. Set build command to `npm run build` and output directory to `dist`.
3. In **Pages → simberwood → Settings → Variables and Secrets**, add encrypted secrets named exactly `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. Set them for Production (and Preview too if you use preview deployments).
4. Save, then trigger a new deployment from the **Deployments** tab.

The adoption and contact forms submit to `/api/applications` and `/api/contact`; Pages Functions write those rows to Supabase. The Functions return a success response only after Supabase accepts the insert.

## Data and admin

`supabase/schema.sql` creates tables for puppies, reviews, gallery items, adoption applications, contact messages, and social proof messages. Row Level Security is enabled, and the secret key remains server-side in Cloudflare.

The existing catalog editor, reviews, gallery, social proof settings, and admin inbox still use browser `localStorage`; those edits do not sync to Supabase yet. Adoption and contact form submissions are stored in Supabase but are not yet fetched into the admin inbox. Protect `/admin` with Cloudflare Access before using it with real customer data; the page itself does not authenticate administrators.

Supabase stores contact and adoption information. Restrict project access to trusted operators and apply a retention policy appropriate to your business.
