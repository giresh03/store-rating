#!/bin/bash

echo "🚀 Starting Store Rating Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose and try again."
    exit 1
fi

echo "📦 Starting services with Docker Compose..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "🗄️  Running database migrations..."
docker-compose exec -T backend npx prisma migrate deploy

echo "🌱 Seeding database with sample data..."
docker-compose exec -T backend npm run db:seed

echo ""
echo "✅ Store Rating Platform is ready!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:3001"
echo "📊 Database: localhost:5432"
echo ""
echo "🔐 Demo Login Credentials:"
echo "   Admin: admin@storerating.com / Admin123!"
echo "   Store Owner: owner1@storerating.com / Owner123!"
echo "   Normal User: alice@customer.com / User123!"
echo ""
echo "📚 Full documentation available in README.md"
echo ""
echo "To stop the application, run: docker-compose down"
