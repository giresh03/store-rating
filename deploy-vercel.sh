#!/bin/bash

# Store Rating Platform - Vercel Deployment Script
# This script helps you deploy both frontend and backend to Vercel

set -e

echo "🚀 Store Rating Platform - Vercel Deployment"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Please login to Vercel first:"
    vercel login
fi

echo ""
echo "📋 Deployment Options:"
echo "1. Deploy Backend Only"
echo "2. Deploy Frontend Only"
echo "3. Deploy Both (Recommended)"
echo "4. Setup Database (Neon/Supabase)"
echo ""

read -p "Select option (1-4): " choice

case $choice in
    1)
        echo "🔧 Deploying Backend..."
        cd backend
        vercel --prod
        ;;
    2)
        echo "🎨 Deploying Frontend..."
        cd frontend
        vercel --prod
        ;;
    3)
        echo "🚀 Deploying Both Backend and Frontend..."
        
        echo "📦 Deploying Backend..."
        cd backend
        vercel --prod
        BACKEND_URL=$(vercel ls | grep -o 'https://[^ ]*\.vercel\.app' | head -1)
        cd ..
        
        echo "📦 Deploying Frontend..."
        cd frontend
        vercel --prod
        FRONTEND_URL=$(vercel ls | grep -o 'https://[^ ]*\.vercel\.app' | head -1)
        cd ..
        
        echo ""
        echo "✅ Deployment Complete!"
        echo "Backend URL: $BACKEND_URL"
        echo "Frontend URL: $FRONTEND_URL"
        echo ""
        echo "📝 Next Steps:"
        echo "1. Update environment variables in Vercel dashboard"
        echo "2. Set up database and run migrations"
        echo "3. Seed the database with initial data"
        ;;
    4)
        echo "🗄️ Database Setup Instructions:"
        echo ""
        echo "Option 1 - Neon (Recommended):"
        echo "1. Go to https://neon.tech"
        echo "2. Create a new project"
        echo "3. Copy the connection string"
        echo "4. Add DATABASE_URL to Vercel environment variables"
        echo ""
        echo "Option 2 - Supabase:"
        echo "1. Go to https://supabase.com"
        echo "2. Create a new project"
        echo "3. Go to Settings > Database"
        echo "4. Copy the connection string"
        echo "5. Add DATABASE_URL to Vercel environment variables"
        echo ""
        echo "After setting up database:"
        echo "1. Run: cd backend && npx prisma migrate deploy"
        echo "2. Run: cd backend && npx prisma db seed"
        ;;
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see VERCEL_DEPLOYMENT.md"
echo "🎉 Happy coding!"
