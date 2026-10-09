# Drew Burton portfolio

A single-page portfolio on **Cloudflare Pages**, with an admin you sign in to for editing text, uploading images and YouTube links, editing what the chat assistant knows, and viewing analytics.

| Piece | Where it lives |
| --- | --- |
| The site | `src/render.mjs` renders the page; `functions/index.js` serves it from the database on each visit. `public/` holds styles, scripts and images. |
| Content | Cloudflare **D1** (SQLite). Original text is in `src/defaults.mjs` and is used for anything you haven't edited. |
| Images | Cloudflare **R2** bucket, served from `/media/...`. |
| Admin | `/admin` (`public/admin/`), API in `functions/api/admin/`. Password login. |
| Analytics | Cookie-free events stored in D1 (`/api/collect`), shown on the admin Overview. |
| Chat (Stanley) | `functions/api/chat.js`, answers from the "Stanley's knowledge" text in the admin. |

## First-time setup

You need a free Cloudflare account and Node 18+.

```bash
npm install
npx wrangler login

# 1. Database. Copy the printed database_id into wrangler.toml
npx wrangler d1 create drew-portfolio

# 2. Image storage
npx wrangler r2 bucket create drew-portfolio-media

# 3. Create the tables
npm run db:remote

# 4. Create the Pages project
npx wrangler pages project create drew-portfolio --production-branch main

# 5. Secrets (you'll be prompted for each value)
npx wrangler pages secret put ADMIN_PASSWORD   --project-name drew-portfolio   # your admin password
npx wrangler pages secret put SESSION_SECRET   --project-name drew-portfolio   # any long random string
npx wrangler pages secret put ANTHROPIC_API_KEY --project-name drew-portfolio  # powers Stanley

# 6. Deploy (always publishes to production, whatever git branch you're on)
npm run deploy
```

Then open `https://drew-portfolio.pages.dev/admin`. Add your own domain under Workers & Pages → drew-portfolio → Custom domains.

Prefer deploying from GitHub? In the Cloudflare dashboard connect this repo, set the build command to `npm run build` and the output directory to `public`. The D1/R2 bindings come from `wrangler.toml`; add the three secrets in the project's settings.

## Using the admin

- **Work history, Projects, About page, Hero & contact**: edit the fields and press **Save changes**. The live site updates straight away.
- **Projects**: upload images (PNG, JPG, WebP, GIF, AVIF up to 10 MB), paste YouTube links, reorder with the arrows. The first image becomes the card and header image. Videos load only when a visitor clicks play.
- **Stanley's knowledge**: the only thing the chat assistant knows. Edit freely.
- **Overview**: page views, visitors, how far people scroll, projects opened, link clicks, referrers, countries, devices and the questions asked in the chat. No cookies, no IP addresses stored, and visitors who send Do Not Track are not counted.
- *Reset to original* on each page puts that section back to the text in `src/defaults.mjs`.

For extra protection you can also put `/admin*` and `/api/admin*` behind Cloudflare Access (Zero Trust → Access → Applications).

## Local development

```bash
cp .dev.vars.example .dev.vars   # then edit the values
npm run db:local                 # creates the local tables
npm run dev                      # http://localhost:8788  (admin at /admin)
```

`npm run build` writes `public/index.html` from the built-in defaults. That file is the fallback page and what the static preview uses.

## Notes

- Tests I ran against the real Cloudflare runtime (Miniflare) cover: sign-in and sign-out, blocked requests, saving and resetting content, escaping of edited text, image upload and serving, rejected file types, unsafe image links, bots and foreign origins being ignored by analytics, and the admin screens in a browser.
- The chat needs a real `ANTHROPIC_API_KEY` to answer; without one it says it isn't configured.
