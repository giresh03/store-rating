# Store Rating Platform

A full-stack web application for rating and managing stores with role-based access control. Built with React, TypeScript, Node.js, Express, PostgreSQL, and Prisma.

## 🚀 Features

### User Roles & Functionalities

#### System Administrator
- Dashboard with platform statistics (total users, stores, ratings)
- User management (create, view, filter, sort, delete users)
- Store management (create, view, manage stores)
- Role-based access control

#### Normal User
- User registration and authentication
- Browse and search stores by name and address
- Rate stores (1-5 stars) with ability to update ratings
- View personal rating history
- Profile management with password updates

#### Store Owner
- Dashboard showing owned stores and their ratings
- View detailed customer feedback and ratings
- Monitor store performance and average ratings
- Profile management

### Technical Features
- JWT-based authentication with secure token management
- Role-based route protection and API access control
- Responsive UI with TailwindCSS
- Real-time form validation with comprehensive error handling
- Pagination and filtering for large datasets
- RESTful API design with proper HTTP status codes
- Database relationships and constraints
- Docker containerization for easy deployment

## 🛠 Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Headless UI** - Accessible components
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy for frontend
- **PostgreSQL** - Database container

## 📋 Requirements

- Node.js 18+
- PostgreSQL 12+
- Docker & Docker Compose (for containerized deployment)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd store-rating-platform
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Initialize the database**
   ```bash
   # Wait for services to start, then run migrations and seed
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npm run db:seed
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up database**
   ```bash
   # Make sure PostgreSQL is running
   npm run db:migrate
   npm run db:generate
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🔐 Demo Credentials

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
- **Email:** charlie@customer.com
- **Password:** User789!
- **Email:** diana@customer.com
- **Password:** User012!

## 📊 Database Schema

### Users Table
- `id` (String, Primary Key)
- `name` (String, 20-60 chars)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: SYSTEM_ADMIN, NORMAL_USER, STORE_OWNER)
- `address` (String, Max 400 chars)
- `createdAt`, `updatedAt` (DateTime)

### Stores Table
- `id` (String, Primary Key)
- `name` (String, Max 100 chars)
- `address` (String, Max 400 chars)
- `avgRating` (Float, Default 0)
- `ownerId` (String, Foreign Key to Users)
- `createdAt`, `updatedAt` (DateTime)

### Ratings Table
- `id` (String, Primary Key)
- `ratingValue` (Integer, 1-5)
- `userId` (String, Foreign Key to Users)
- `storeId` (String, Foreign Key to Stores)
- `createdAt`, `updatedAt` (DateTime)
- Unique constraint on (userId, storeId)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/password` - Update password
- `POST /api/auth/logout` - Logout

### Users (Admin only)
- `GET /api/users` - Get all users with filtering
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `POST /api/admin/users` - Create new user

### Stores
- `GET /api/stores` - Get all stores with filtering
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store (Admin only)
- `PUT /api/stores/:id` - Update store (Admin only)
- `DELETE /api/stores/:id` - Delete store (Admin only)
- `GET /api/stores/owner/me` - Get stores by owner

### Ratings
- `POST /api/ratings` - Create/update rating (Normal users)
- `GET /api/ratings/me` - Get user's ratings
- `GET /api/ratings/store/:storeId` - Get store ratings
- `GET /api/ratings/store/:storeId/stats` - Get rating statistics
- `DELETE /api/ratings/store/:storeId` - Delete rating

## 🔒 Form Validations

### User Registration/Creation
- **Name:** 20-60 characters
- **Email:** Valid email format
- **Password:** 8-16 characters with uppercase letter and special character
- **Address:** Maximum 400 characters

### Store Creation
- **Name:** 1-100 characters
- **Address:** Maximum 400 characters
- **Owner:** Must be a valid store owner user

### Ratings
- **Rating Value:** Integer between 1-5
- **Store:** Must be a valid store ID
- **User:** One rating per user per store

## 🏗 Project Structure

```
store-rating-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── middleware/      # Auth, error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities (JWT, bcrypt)
│   │   ├── validation/      # Input validation schemas
│   │   └── scripts/         # Database seeds
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── config/          # Configuration
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🧪 Testing the Application

1. **Login as Admin**
   - Access user management and create new users
   - View dashboard statistics
   - Manage stores

2. **Login as Normal User**
   - Browse store listings
   - Rate stores and update ratings
   - Search and filter stores
   - View personal rating history

3. **Login as Store Owner**
   - View owned stores and their ratings
   - Monitor customer feedback
   - Check store performance metrics

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs backend       # View backend logs
docker-compose logs frontend      # View frontend logs
docker-compose exec backend bash  # Access backend container
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   - Update environment variables in `docker-compose.yml`
   - Set strong JWT secrets and database passwords
   - Configure proper CORS origins

2. **Database Migration**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

3. **SSL/HTTPS Setup**
   - Add SSL certificates
   - Configure reverse proxy (Nginx/Apache)
   - Update CORS and security headers

4. **Monitoring & Logging**
   - Set up application monitoring
   - Configure log aggregation
   - Implement health checks

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
```

#### Frontend
```env
VITE_API_URL="https://api.yourdomain.com"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check database credentials in .env
   - Verify database exists

2. **Port Conflicts**
   - Change ports in docker-compose.yml if needed
   - Check if ports 3001, 5173, 5432 are available

3. **Migration Errors**
   - Reset database: `npm run db:reset`
   - Check Prisma schema syntax
   - Ensure database permissions

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify TypeScript configurations

### Getting Help

- Check the GitHub Issues page
- Review error logs in console/terminal
- Verify all environment variables are set
- Ensure all dependencies are installed

---

Built with ❤️ for the Store Rating Platform project.
