#!/bin/bash

echo "🛠️  Setting up Store Rating Platform for development..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Setup backend
echo "📦 Setting up backend..."
cd backend

echo "📥 Installing backend dependencies..."
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cat > .env << EOL
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/store_rating_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:5173"
EOL
    echo "✅ Created .env file"
else
    echo "ℹ️  .env file already exists"
fi

echo "🗄️  Generating Prisma client..."
npx prisma generate

echo "📊 Please ensure PostgreSQL is running and create the database:"
echo "   createdb store_rating_db"
echo ""
echo "Then run migrations and seed data:"
echo "   npm run db:migrate"
echo "   npm run db:seed"

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

echo "📥 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Development setup complete!"
echo ""
echo "🚀 To start development:"
echo "   1. Start PostgreSQL service"
echo "   2. Run 'cd backend && npm run db:migrate && npm run db:seed'"
echo "   3. Run 'npm run dev' from the root directory"
echo ""
echo "📚 Check README.md for detailed instructions"
