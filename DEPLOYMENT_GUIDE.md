# Deployment Guide

## Redeploying After Code Changes

### Backend (Render)
Render auto-deploys when you push to the `main` branch. Just run:
```bash
git add .
git commit -m "Your changes"
git push origin main
```
Render will automatically rebuild and deploy (~2-3 minutes).

### Frontend (Vercel)
Vercel also auto-deploys on push to `main`. Same process:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Updating Environment Variables

### Backend (Render)
1. Go to https://dashboard.render.com
2. Select `sherlock-osint-backend`
3. Go to **Environment** tab
4. Add/edit variables, then click **Save Changes**
5. Render will auto-redeploy

### Frontend (Vercel)
1. Go to https://vercel.com/dashboard
2. Select `osint-hub` project
3. Go to **Settings** → **Environment Variables**
4. Edit variables, then click **Save**
5. Go to **Deployments** → click **...** on latest → **Redeploy**

## Common Issues

### Backend cold start (Render free tier)
- First request after inactivity takes 30-50 seconds
- This is normal for free tier
- Upgrade to paid tier ($7/month) to prevent sleeping

### CORS errors
- Backend must have CORS enabled for your Vercel domain
- Check `backend/src/server.js` CORS configuration

### API calls failing
- Verify `VITE_API_URL` is set correctly in Vercel
- Check browser DevTools Network tab for request URLs

## Useful Commands

```bash
# Test backend locally
cd backend && npm run dev

# Test frontend locally
cd frontend && npm run dev

# Check deployment logs
# Render: Dashboard → Logs tab
# Vercel: Dashboard → Deployments → click deployment → Logs
```
