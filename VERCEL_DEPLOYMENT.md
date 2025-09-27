# Vercel Deployment Guide

This guide will help you deploy your Store Rating Platform to Vercel. Since Vercel is primarily designed for frontend applications and serverless functions, we'll need to adapt the architecture for optimal deployment.

## 🏗 Architecture Overview

For Vercel deployment, we'll use a **two-project approach**:

1. **Backend API** - Deployed as Vercel Functions (Serverless)
2. **Frontend** - Deployed as Static Site
3. **Database** - External PostgreSQL service (Neon/Supabase)

## 📋 Prerequisites

- Vercel account
- GitHub repository
- External PostgreSQL database (Neon, Supabase, or Railway)
- Node.js 18+ installed locally

## 🗄️ Database Setup

### Option 1: Neon (Recommended)

1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Note down your database URL for environment variables

### Option 2: Supabase

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Note down your database URL for environment variables

### Option 3: Railway

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string

## 🚀 Deployment Steps

### Step 1: Prepare the Repository

1. **Push your code to GitHub** (if not already done)
2. **Ensure all files are committed** including the new Vercel configuration files

### Step 2: Deploy Backend API

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the backend project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Set Environment Variables:**
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

6. **Deploy the backend**

### Step 3: Deploy Frontend

1. **Create another Vercel project**
2. **Import the same GitHub repository**
3. **Configure the frontend project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Set Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-domain.vercel.app
   ```

5. **Deploy the frontend**

### Step 4: Database Migration

After deploying the backend, you need to run database migrations:

1. **Option A: Using Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   vercel env pull .env.local
   cd backend
   npx prisma migrate deploy
   npx prisma db seed
   ```

2. **Option B: Using Prisma Studio (Web)**
   - Use the database provider's web interface
   - Run the SQL commands from your migration files

3. **Option C: Direct Database Connection**
   - Connect to your database using a client
   - Run the migration SQL manually

## 🔧 Alternative: Single Project Deployment

If you prefer a single project approach, you can use the root `vercel.json` configuration:

1. **Deploy from root directory**
2. **Set both frontend and backend environment variables**
3. **Use the combined configuration**

## 🌐 Custom Domains (Optional)

1. **In Vercel Dashboard**, go to your project
2. **Click "Domains"**
3. **Add your custom domain**
4. **Update environment variables** with new domain URLs
5. **Redeploy both projects**

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Verify build scripts are correct

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check if database allows external connections
   - Ensure SSL is properly configured

3. **CORS Issues**
   - Update `FRONTEND_URL` in backend environment variables
   - Check if frontend URL is accessible

4. **Environment Variables Not Loading**
   - Ensure variables are set in Vercel dashboard
   - Check variable names match exactly
   - Redeploy after adding variables

### Debugging Tips

1. **Check Vercel Function Logs**
   - Go to Functions tab in Vercel dashboard
   - View real-time logs

2. **Test API Endpoints**
   - Use tools like Postman or curl
   - Test health endpoint: `GET /health`

3. **Frontend Console Errors**
   - Check browser developer tools
   - Verify API URL configuration

## 📊 Post-Deployment

### Initial Setup

1. **Seed the database** with initial data:
   ```bash
   # If using Vercel CLI
   cd backend
   npx prisma db seed
   ```

2. **Test all functionality:**
   - User registration/login
   - Store management
   - Rating system
   - Admin dashboard

### Monitoring

1. **Set up Vercel Analytics** (optional)
2. **Monitor function performance**
3. **Set up error tracking** (Sentry, etc.)

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to repository
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use strong database passwords
   - Enable SSL connections
   - Restrict database access

3. **API Security**
   - Rate limiting is enabled in production
   - CORS is properly configured
   - Helmet security headers are active

## 🎯 Demo Credentials

After deployment and seeding, you can use these credentials:

### System Administrator
- **Email:** admin@storerating.com
- **Password:** Admin123!

### Store Owners
- **Email:** owner1@storerating.com
- **Password:** Owner123!
- **Email:** owner2@storerating.com
- **Password:** Owner456!

### Normal Users
- **Email:** alice@customer.com
- **Password:** User123!
- **Email:** bob@customer.com
- **Password:** User456!

## 📝 Next Steps

1. **Set up monitoring and logging**
2. **Configure CI/CD for automatic deployments**
3. **Add SSL certificates for custom domains**
4. **Implement backup strategies for database**
5. **Set up performance monitoring**

## 🆘 Support

If you encounter issues:

1. Check Vercel documentation
2. Review Prisma deployment guides
3. Check database provider documentation
4. Review function logs in Vercel dashboard

---

**Note:** This deployment approach uses Vercel's serverless functions for the backend. For high-traffic applications, consider using Vercel's Edge Functions or a dedicated server solution.
