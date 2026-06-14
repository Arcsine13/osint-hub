# Deployment Status

## Live Links

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://osint-hub-ten.vercel.app | ✅ Live |
| **Backend** | https://osint-hub-n8vd.onrender.com | ✅ Live |
| **GitHub** | https://github.com/Arcsine13/osint-hub | ✅ Live |

## Deployment Date

June 14, 2026

## Architecture

- **Frontend** → React + Vite on Vercel (uses Vercel rewrites to proxy `/api/*` to backend)
- **Backend** → Node.js + Express in Docker on Render (includes Python/Sherlock)
- **Database** → SQLite via sql.js (WebAssembly)

## Notes

- Render free tier sleeps after 15 min inactivity (cold start ~30-50s)
- Username search uses HTTP-based fallback (checks 25 platforms directly)
- For full Sherlock integration, install Python + sherlock-project in the Dockerfile
