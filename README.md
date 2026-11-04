# Simberwood Cocker Spaniels

Responsive React and Vite website for Simberwood, with Cloudflare Pages Functions and a D1 schema for adoption applications and contact messages.

## Run locally

```sh
npm install
npm run dev
```

The D1-backed forms need the Pages Functions runtime and a local D1 database. Install Wrangler, create the database as described below, set `database_id` in `wrangler.toml`, then run `npx wrangler pages dev dist` after building. Configure the local D1 database binding before relying on form submissions.

## Deploy to Cloudflare Pages

1. Create a GitHub repository named `simberwood` and push this project.
2. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git** and select that repository.
3. Use `npm run build` as the build command and `dist` as the output directory. Cloudflare Pages reads the Functions from `functions/`.
4. Create a D1 database named `simberwood-db` and copy its ID into `wrangler.toml` in place of `REPLACE_WITH_D1_DATABASE_ID`.
5. From the project directory, run `npx wrangler d1 execute simberwood-db --remote --file=migrations/0001_initial.sql` to create the tables.
6. Make sure the Pages D1 binding is named `DB` and points to `simberwood-db` (the binding is also declared in `wrangler.toml`). Redeploy after changing the binding.
7. Test an adoption application and contact message on the deployed URL. Each form should show confirmation only after D1 accepts the record.

### If the build is running under Workers Builds

The deploy log must not use `npx wrangler deploy`; that command publishes a Worker and fails for this Pages project. In the Cloudflare dashboard, open the connected Worker's **Settings → Build** and change **Deploy command** to `npm run deploy`. This project script runs `wrangler pages deploy dist --project-name simberwood`. Confirm that the Pages project is named `simberwood` and the build token has Pages deployment permission. For automatic Pages Git deployments, connect the repository as a **Pages** project instead, set build command to `npm run build` and output directory to `dist`, and do not configure a Worker deploy command.

## Data and admin

`migrations/0001_initial.sql` creates tables for puppies, reviews, gallery items, adoption applications, contact messages, and social proof messages. The public adoption and contact forms write to D1 through Pages Functions. The existing admin editor and catalog content still use browser `localStorage`; those edits do not sync across devices or persist as a shared D1 catalog. The admin inbox also reads local browser storage, so D1 submissions will not appear there on another device yet. Protect `/admin` with Cloudflare Access before using it with real customer data. Do not treat the client-side admin page as an authentication boundary.

Cloudflare D1 stores contact details and adoption applications, which contain personal information. Restrict Cloudflare dashboard access to trusted operators and apply a retention policy appropriate to your business.
