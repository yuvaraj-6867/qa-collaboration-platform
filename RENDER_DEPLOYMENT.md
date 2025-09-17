# Render Deployment Fix

## Issues Fixed

1. **Gemfile Location**: Updated `render.yaml` to use `rootDir: backend` for the Rails service
2. **Database Service**: Added PostgreSQL database configuration
3. **Build Commands**: Fixed build and start commands to run from correct directories
4. **Package.json Conflict**: Removed root `package.json` that was causing Node.js detection

## Updated render.yaml Configuration

The render.yaml now includes:
- Backend Rails service with proper root directory
- Frontend static site service
- PostgreSQL database service
- Proper environment variables

## Environment Variables Needed

Add these in your Render dashboard:
- `SECRET_KEY_BASE` (auto-generated)
- `DATABASE_URL` (auto-provided by database service)

## Deployment Steps

1. Push the updated `render.yaml` to your repository
2. In Render dashboard, create a new service from your repository
3. Render will automatically detect the render.yaml and create all services
4. Wait for deployment to complete

## Service URLs

After deployment:
- Backend API: `https://qa-platform-backend.onrender.com`
- Frontend: `https://qa-platform-frontend.onrender.com`
- Database: Internal connection via DATABASE_URL

## Frontend API Configuration

Update your frontend API calls to use the production backend URL:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://qa-platform-backend.onrender.com/api/v1'
  : 'http://localhost:3001/api/v1';
```