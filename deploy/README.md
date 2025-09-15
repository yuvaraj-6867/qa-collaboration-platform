# Free Deployment Guide

## Frontend (Netlify - Free)
1. Push code to GitHub
2. Connect Netlify to your repo
3. Deploy from `frontend/` folder
4. Auto-deploys on push

## Backend + Database (Render - Free)
1. Connect Render to your GitHub repo
2. **IMPORTANT**: Set Root Directory to `backend/` in service settings
3. Add PostgreSQL database (free tier)
4. Set environment variables:
   - `DATABASE_URL` (auto-provided)
   - `RAILS_ENV=production`

## Alternative: Heroku (Free tier ended)
- Web Service: Deploy backend
- PostgreSQL: Free database
- Static Site: Deploy frontend

## Environment Variables
```
# Backend
DATABASE_URL=postgresql://...
RAILS_ENV=production
SECRET_KEY_BASE=your_secret_key

# Frontend
VITE_API_URL=https://your-backend.railway.app
```

## Commands
```bash
# Generate secret key
rails secret

# Database setup
rails db:create db:migrate

# Build frontend
npm run build
```