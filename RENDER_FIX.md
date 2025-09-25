# Render Deployment Fix Guide

## பிரச்சனை (Problem)
Local-ல் work ஆகுது ஆனா Render-ல் work ஆகல

## தீர்வு (Solution)

### 1. render.yaml Configuration Fixed
- Backend service name: `qa-collaboration-platform`
- Frontend service name: `qa-platform-frontend`
- Proper rootDir settings added
- Database service configured

### 2. Environment Variables Setup

#### Backend Environment Variables (Render Dashboard-ல் add பண்ணுங்க):
```
RAILS_ENV=production
RAILS_SERVE_STATIC_FILES=true
RAILS_LOG_TO_STDOUT=true
SECRET_KEY_BASE=[auto-generated]
DATABASE_URL=[auto-provided by database service]
```

#### Frontend Environment Variables:
```
VITE_API_URL=https://qa-collaboration-platform.onrender.com/api/v1
```

### 3. Deployment Steps

1. **Git push your changes:**
   ```bash
   git add .
   git commit -m "Fix Render deployment configuration"
   git push origin main
   ```

2. **Render Dashboard-ல்:**
   - Go to https://render.com/dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository with render.yaml
   - Click "Apply"

3. **Services Created:**
   - Backend: `https://qa-collaboration-platform.onrender.com`
   - Frontend: `https://qa-platform-frontend.onrender.com`
   - Database: PostgreSQL (internal)

### 4. Common Issues & Fixes

#### Issue 1: Build Fails
```bash
# Check logs in Render dashboard
# Usually missing dependencies or wrong paths
```

#### Issue 2: Database Connection Error
```bash
# Ensure DATABASE_URL is set automatically
# Check if PostgreSQL service is running
```

#### Issue 3: CORS Errors
```bash
# Already configured in backend/config/initializers/cors.rb
# Allows all origins for now
```

#### Issue 4: API Not Found (404)
```bash
# Check if backend URL is correct in frontend/.env.production
# Should be: https://qa-collaboration-platform.onrender.com/api/v1
```

### 5. Testing After Deployment

1. **Backend API Test:**
   ```bash
   curl https://qa-collaboration-platform.onrender.com/up
   # Should return: OK
   ```

2. **Frontend Test:**
   - Visit: https://qa-platform-frontend.onrender.com
   - Should load the React app

3. **API Integration Test:**
   - Try login from frontend
   - Check browser network tab for API calls

### 6. Debugging

#### Check Backend Logs:
- Render Dashboard → qa-collaboration-platform → Logs

#### Check Frontend Build:
- Render Dashboard → qa-platform-frontend → Logs

#### Common Log Errors:
```bash
# Gemfile not found → Fixed with rootDir: backend
# Package.json not found → Fixed with rootDir: frontend  
# Database connection → Check DATABASE_URL
# Port binding → Using $PORT variable
```

### 7. Production URLs
After successful deployment:
- **Frontend**: https://qa-platform-frontend.onrender.com
- **Backend API**: https://qa-collaboration-platform.onrender.com/api/v1
- **Health Check**: https://qa-collaboration-platform.onrender.com/up

## Next Steps
1. Push the fixed configuration
2. Deploy via Render Blueprint
3. Test the deployed application
4. Update any hardcoded URLs if needed