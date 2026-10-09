# Drew Burton portfolio

A single-page portfolio on **Cloudflare Workers**, with an admin you sign in to for editing text, uploading images and YouTube links, editing what the chat assistant knows, and viewing analytics.

| Piece | Where it lives |
| --- | --- |
| The Worker | `src/server/worker.js` routes requests. `src/server/index.js` serves the page from the database; `src/render.mjs` builds the HTML. |
| Static files | `public/` (styles, scripts, images, `/admin` screens) served through the `ASSETS` binding. |
| Content | Cloudflare **D1** (SQLite). Original text is in `src/defaults.mjs` and is used for anything you haven't edited. |
| Images | Cloudflare **R2** bucket, served from `/media/...`. |
| Admin | `/admin` (`public/admin/`), API in `src/server/api/admin/`. Password login. |
| Analytics | Cookie-free events stored in D1 (`/api/collect`), shown on the admin Overview. |
| Chat (Stanley) | `src/server/api/chat.js`, answers from the "Stanley's knowledge" text in the admin. |

Configuration is in `wrangler.toml`. Secrets never go in that file.

## Deploy from GitHub (dashboard)

1. **Database.** Dashboard → Storage & Databases → D1 → Create database, named `drew-portfolio`. Copy its **Database ID**.
2. **Put the ID in the code.** On GitHub edit `wrangler.toml` and replace `REPLACE_WITH_YOUR_D1_ID`. Commit to `main`.
3. **Create the tables.** In the D1 database open **Console**, paste everything from `migrations/0001_init.sql`, and run it.
4. **Image storage.** Dashboard → R2 Object Storage → Create bucket named `drew-portfolio-media`.
5. **Create the app.** Workers & Pages → Create → Import a repository → this repo.
   Project name: `portfolio` (must match `name` in `wrangler.toml`). Build command: leave empty. Deploy command: `npx wrangler deploy`. Deploy.
6. **Secrets.** Worker → Settings → Variables and Secrets → add `ADMIN_PASSWORD`, `SESSION_SECRET` (any long random string) and `ANTHROPIC_API_KEY`. Choose type **Secret**.
7. **Your domain.** Add the domain to Cloudflare (change nameservers at your registrar), then Worker → Settings → Domains & Routes → Add → Custom domain.

From then on every push to `main` redeploys. Content you save in `/admin` never needs a deploy.

## Deploy from the command line (alternative)

```bash
npm install
npx wrangler login
npx wrangler d1 create drew-portfolio          # put the id in wrangler.toml
npx wrangler r2 bucket create drew-portfolio-media
npm run db:remote
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
npx wrangler secret put ANTHROPIC_API_KEY
npm run deploy
```

## Using the admin

- **Work history, Projects, About page, Hero & contact**: edit the fields and press **Save changes**. The live site updates straight away.
- **Projects**: upload images (PNG, JPG, WebP, GIF, AVIF up to 10 MB), paste YouTube links, reorder with the arrows. The first image becomes the card and header image. Videos load only when a visitor clicks play.
- **Stanley's knowledge**: the only thing the chat assistant knows. Edit freely.
- **Overview**: page views, visitors, how far people scroll, projects opened, link clicks, referrers, countries, devices and the questions asked in the chat. No cookies, no IP addresses stored, and visitors who send Do Not Track are not counted.
- *Reset to original* on each page restores that section to the text in `src/defaults.mjs`.

For extra protection, put `/admin*` and `/api/admin*` behind Cloudflare Access (Zero Trust → Access → Applications).

## Local development

```bash
cp .dev.vars.example .dev.vars   # then edit the values
npm run db:local                 # creates the local tables
npm run dev                      # http://localhost:8788  (admin at /admin)
```

`npm run build` writes `preview/index.html` from the built-in defaults, a static copy for quick previews.

## Notes

- The Worker runs first for `/`, `/api/*` and `/media/*`; everything else comes from `public/`. Don't add `public/index.html`, or it would be served instead of the database-driven page.
- 
- Back up your content now and then: `npx wrangler d1 export drew-portfolio --remote --output backup.sql`.
