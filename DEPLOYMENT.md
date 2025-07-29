# Deployment Guide

## Deploy to Render

### 1. Database Setup (Neon.tech)
1. Go to [Neon.tech](https://neon.tech) and create a new project
2. Copy the connection string (e.g., `postgresql://username:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require`)

### 2. Deploy to Render
1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `revobricks-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or set to backend-core if in monorepo)
   - **Runtime**: `Node`
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `npm run start:prod`

### 3. Environment Variables
Add these in Render dashboard → Environment:

```
NODE_ENV=production
DATABASE_URL=your_neon_connection_string_here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
PORT=3000
TYPEORM_SYNCHRONIZE=false
```

### 4. Firebase Service Account
1. Upload `revobricks-firebase-adminsdk.json` to Render (or use environment variables)
2. Set `FIREBASE_SERVICE_ACCOUNT_PATH=./revobricks-firebase-adminsdk.json`

### 5. Database Schema
Since synchronize is disabled in production, you need to create tables manually:

1. Connect to your Neon database
2. Run the SQL commands to create tables (or use a migration tool)

## API Endpoints

- **Swagger UI**: `https://your-app.onrender.com/api`
- **Employee Auth**: `https://your-app.onrender.com/employees`
- **User Auth**: `https://your-app.onrender.com/auth/users/authenticate`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment | `production` |
| DATABASE_URL | Neon connection string | `postgresql://...` |
| JWT_SECRET | JWT signing key | `your-secret-key` |
| PORT | Server port | `3000` |
| TYPEORM_SYNCHRONIZE | Auto-sync schema | `false` |