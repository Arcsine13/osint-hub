# Deployment Status

## Live Links

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://osint-hub-ten.vercel.app | ✅ Live |
| **Backend** | https://sherlock-osint-backend.onrender.com | ✅ Live |
| **GitHub** | https://github.com/Arcsine13/osint-hub | ✅ Live |

## Deployment Date

June 14, 2026

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS (deployed on Vercel)
- **Backend**: Node.js + Express + Socket.io (deployed on Render)
- **Database**: SQLite via sql.js (WebAssembly)

## Notes

- Render free tier: App sleeps after 15 minutes of inactivity (cold start takes ~30-50 seconds)
- Vercel: No cold starts, instant deployment
- API keys are optional — app works without them but with limited results
