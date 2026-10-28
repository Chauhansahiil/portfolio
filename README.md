# Portfolio

Static site (HTML, CSS, JS) plus a tiny Cloudflare Worker that holds the private values.

## What is kept out of GitHub
- SheetDB URL -> Worker secret `SHEETDB_URL`
- Resume link -> Worker secret `RESUME_URL` (the site links to `<worker>/resume`)
- Nothing secret is in `index.html`, `script.js`, `enhance.js` or `config.js`.

## One-time setup (about 5 minutes)
1. In SheetDB, create a **new** API endpoint (the old URL was in your old code, so treat it as used) and, if you can, turn on SheetDB's own protection.
2. In this folder: `cd worker`, then `npx wrangler login`.
3. `npx wrangler secret put SHEETDB_URL` (paste the new SheetDB URL)
4. `npx wrangler secret put RESUME_URL` (paste your Google Drive resume link)
5. Edit `ALLOWED_ORIGINS` in `worker/wrangler.toml` to your real site address, then `npx wrangler deploy`.
6. Copy the printed `https://portfolio-api.<you>.workers.dev` address into `WORKER_URL` in `config.js`.
7. Commit and push. Turn on GitHub Pages for the repo.

## Local testing
Live Server on port 5501 is already allowed. Until the Worker is deployed the contact form shows a "not connected" message and the resume button jumps to Contact.
