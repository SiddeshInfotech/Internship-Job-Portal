# Placify — Deployment Guide (Frontend)

## Build
```bash
npm install
npm run build        # outputs static site to dist/
```

## Environment
- `VITE_API_URL` — Flask backend base URL (defaults to the live Render URL if unset).
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID for student login.
- Copy `.env.example` → `.env` and fill values. Never commit real secrets.

## Hosting the `dist/` folder
Any static host works (Vercel, Netlify, Render Static Site, Hostinger).
**Required:** SPA fallback so React Router deep links work —
- Vercel/Netlify: add a rewrite of `/*` → `/index.html`.
- Render Static Site: Rewrite rule `/* → /index.html`.
- Apache (Hostinger): `.htaccess` with `RewriteRule . /index.html [L]` (after real-file checks).

## Post-deploy smoke test
1. Home page: persona toggle, runway animation, live "Now hiring" ticker (needs backend awake).
2. Auth: student login (incl. Google), company login/register, admin login.
3. Admin: Manage Students / Companies / Job Posts / Applications — verify names, dates, counts render (backend field fallbacks are in `src/utils/fields.js`).
4. Company portal: post a job → submit → view applicants → shortlist.
5. Note: Render free tier sleeps — first API call after idle takes 30–60s.

## Known non-blockers
- `npm run lint` fails from a pre-existing ESLint 8 vs flat-config mismatch
  (upgrade to `eslint@^9` to fix). Does not affect `npm run build`.
- `POST /api/student/change-password` backend endpoint is still pending (flagged earlier).
- Applications count on admin Manage Job Posts needs the backend to return a
  count field on `/admin/jobs` if it currently doesn't (see field fallbacks).
