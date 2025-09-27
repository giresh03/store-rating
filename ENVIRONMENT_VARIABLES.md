# Environment Variables Configuration

This document explains all the environment variables needed for deploying the Store Rating Platform to Vercel.

## 🔧 Backend Environment Variables

Set these in your **Backend Vercel Project**:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your-super-secret-jwt-key-at-least-32-characters-long` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend application URL | `https://your-frontend.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |

## 🎨 Frontend Environment Variables

Set these in your **Frontend Vercel Project**:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.vercel.app` |

## 🗄️ Database Connection Strings

### Neon Database
```
postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/database_name?sslmode=require
```

### Supabase Database
```
postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Railway Database
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:xxxx/railway
```

## 🔐 Security Best Practices

### JWT Secret Generation
Generate a strong JWT secret using one of these methods:

**Option 1: Online Generator**
- Use a secure password generator
- Minimum 32 characters
- Include letters, numbers, and symbols

**Option 2: Command Line**
```bash
# Generate random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using openssl
openssl rand -hex 32
```

### Database Security
1. **Use strong passwords** (minimum 12 characters)
2. **Enable SSL connections** (`?sslmode=require`)
3. **Restrict database access** to your application only
4. **Regular password rotation**

## 🚀 Setting Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to your Vercel project dashboard**
2. **Click on "Settings" tab**
3. **Click on "Environment Variables"**
4. **Add each variable:**
   - Name: `DATABASE_URL`
   - Value: Your database connection string
   - Environment: Production (and Preview if needed)
5. **Click "Save"**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add NODE_ENV
vercel env add FRONTEND_URL

# For frontend project
vercel env add VITE_API_URL
```

### Method 3: Bulk Import

Create a `.env` file and import:

```bash
vercel env pull .env.local
# Edit .env.local with your values
vercel env push .env.local
```

## 🔄 Environment-Specific Configuration

### Development
```env
DATABASE_URL="postgresql://localhost:5432/store_rating_dev"
JWT_SECRET="development-secret-key-not-for-production"
JWT_EXPIRES_IN="24h"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### Production
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
FRONTEND_URL="https://your-frontend.vercel.app"
```

## ✅ Verification Checklist

Before deploying, ensure:

- [ ] All required environment variables are set
- [ ] Database connection string is valid and accessible
- [ ] JWT secret is at least 32 characters long
- [ ] Frontend URL points to your actual frontend deployment
- [ ] API URL in frontend points to your actual backend deployment
- [ ] SSL is enabled for database connections
- [ ] Environment variables are set for the correct environments (Production/Preview)

## 🐛 Common Issues

### Database Connection Errors
- **Issue:** `Connection refused` or `ECONNREFUSED`
- **Solution:** Check database URL format and ensure database is accessible from internet

### JWT Token Errors
- **Issue:** `JsonWebTokenError: invalid signature`
- **Solution:** Ensure JWT_SECRET is the same across all environments

### CORS Errors
- **Issue:** `Access-Control-Allow-Origin` errors
- **Solution:** Update FRONTEND_URL to match your actual frontend domain

### Environment Variable Not Loading
- **Issue:** `undefined` values in code
- **Solution:** Ensure variable names match exactly (case-sensitive)

## 📝 Example Configuration

### Backend Project Environment Variables
```
DATABASE_URL=postgresql://store_user:SecurePass123!@ep-cool-name-123456.us-east-1.aws.neon.tech/store_rating?sslmode=require
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://store-rating-frontend.vercel.app
```

### Frontend Project Environment Variables
```
VITE_API_URL=https://store-rating-backend.vercel.app
```

## 🔄 Updating Environment Variables

After updating environment variables:

1. **Redeploy your applications**
2. **Clear browser cache** (for frontend changes)
3. **Test all functionality**
4. **Check application logs** for any errors

---

**Important:** Never commit actual environment variables to your repository. Always use `.env.example` files for templates.
