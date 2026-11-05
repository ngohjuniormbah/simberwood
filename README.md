# Simberwood Cocker Spaniels

React and Vite website deployed on Vercel, with Vercel Functions for form submissions and Supabase PostgreSQL for application/contact storage.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project**, import `ngohjuniormbah/simberwood` from GitHub, and deploy.
2. Vercel detects Vite. The repository's `vercel.json` sets `npm run build`, the `dist` output, and SPA deep-link routing.
3. In the Vercel project, open **Settings → Environment Variables** and add `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and a strong private `ADMIN_DASHBOARD_PASSWORD` for Production (and Preview if needed).
4. Redeploy after adding the variables. Future commits to the connected GitHub branch deploy automatically.
5. Add your domain in **Settings → Domains** and follow Vercel's DNS instructions.

## Set up Supabase

1. Create a Supabase project.
2. Open **SQL Editor → New query**.
3. Copy the full contents of `supabase/schema.sql` from this repository and click **Run**.
4. From **Project Settings → API**, copy the Project URL. From **Project Settings → API Keys**, copy a secret API key (starts with `sb_secret_`).
5. Add those values to Vercel as `SUPABASE_URL` and `SUPABASE_SECRET_KEY`.

The secret key grants elevated database access. It is sent only by server-side API functions and must never be put in browser code, a `VITE_` variable, or GitHub.

## Data scope

The adoption form writes to `adoption_applications` and the contact form writes to `contact_messages` through Vercel API routes. Puppy, review, gallery, and hero slideshow images are stored in Supabase Storage; editable puppy/review/gallery content is synchronized through Supabase.

The hero slideshow settings and uploaded background images are stored in Supabase. In the Admin **Settings** tab, enter the `ADMIN_DASHBOARD_PASSWORD` configured in Vercel before saving or uploading; images are uploaded to the public `hero-backgrounds` bucket. The rest of the admin page itself has no authentication, so protect `/admin` with Vercel Deployment Protection or another access-control layer before using its other editing tools.

Vercel hosts the website and its API routes. Cloudflare is no longer required for application hosting.
