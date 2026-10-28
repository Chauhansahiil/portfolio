# Sahil Chauhan | Data Analyst Portfolio

Personal portfolio website for Sahil Chauhan, a B.Tech graduate in Artificial Intelligence from Nagpur, India, looking for Data Analyst roles.

**Live site:** https://chauhansahiil.github.io/portfolio/

## Features
- Sections for about, experience, projects, skills, certifications, education and contact
- Scroll animations, a cursor-reactive background and a timeline that draws itself as you scroll
- AI assistant (press Ctrl+K) that answers questions about my projects, skills, education and resume
- Contact form with validation, saved to Google Sheets through a small Cloudflare Worker, so no private links are stored in this repository

## Built with
HTML, CSS, JavaScript, jQuery, Typed.js and Cloudflare Workers.

## Run locally
1. Clone the repository.
2. Open `index.html` with a local server such as VS Code Live Server.

The contact form and resume download need a deployed Worker (see below), so they show a "not connected" message locally until you set one up.

## Set up your own Worker (optional)
1. Create a SheetDB API connected to a sheet with the columns `Name`, `Email`, `Phone No.` and `Message`.
2. In the `worker` folder, run `npx wrangler login`.
3. Run `npx wrangler secret put SHEETDB_URL` and paste your SheetDB URL.
4. Run `npx wrangler secret put RESUME_URL` and paste your resume link.
5. Set `ALLOWED_ORIGINS` in `worker/wrangler.toml` to your site address, then run `npx wrangler deploy`.
6. Put the printed Worker address into `WORKER_URL` in `config.js`.

## Contact
- Email: chauhansahil03115@gmail.com
- LinkedIn: https://www.linkedin.com/in/sahil-chauhan-490b0021a/
- GitHub: https://github.com/Chauhansahiil