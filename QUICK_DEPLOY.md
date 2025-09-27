# 🚀 Quick Deploy to Vercel

Get your Store Rating Platform deployed to Vercel in under 10 minutes!

## ⚡ Quick Start (5 Steps)

### 1. Set Up Database (2 minutes)
- Go to [Neon.tech](https://neon.tech) (recommended)
- Create a new project
- Copy the connection string

### 2. Deploy Backend (3 minutes)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy backend
cd backend
vercel --prod
```

### 3. Deploy Frontend (2 minutes)
```bash
# Deploy frontend
cd ../frontend
vercel --prod
```

### 4. Configure Environment Variables (2 minutes)
In Vercel Dashboard:

**Backend Project:**
- `DATABASE_URL` = Your Neon connection string
- `JWT_SECRET` = Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `JWT_EXPIRES_IN` = `7d`
- `NODE_ENV` = `production`
- `FRONTEND_URL` = Your frontend Vercel URL

**Frontend Project:**
- `VITE_API_URL` = Your backend Vercel URL

### 5. Initialize Database (1 minute)
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

## 🎉 You're Done!

Your app is now live at your Vercel URLs!

## 🔑 Demo Login Credentials

After seeding:
- **Admin:** admin@storerating.com / Admin123!
- **User:** alice@customer.com / User123!
- **Owner:** owner1@storerating.com / Owner123!

## 📚 Need More Details?

- **Full Guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Environment Variables:** [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- **Deployment Script:** `./deploy-vercel.sh`

## 🆘 Common Issues

**Build Fails?**
- Check Node.js version (18+)
- Verify all dependencies in package.json

**Database Connection Error?**
- Check DATABASE_URL format
- Ensure database allows external connections

**CORS Errors?**
- Update FRONTEND_URL in backend environment variables
- Make sure URLs match exactly

---

**Pro Tip:** Use the deployment script for automated deployment:
```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```
