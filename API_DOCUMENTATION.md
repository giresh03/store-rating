# Store Rating Platform - API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string,
  "details": string[]
}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new normal user account.

**Request Body:**
```json
{
  "name": "John Doe Customer Account Name",
  "email": "john@example.com",
  "password": "Password123!",
  "address": "123 Main Street, City, State, Country"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe Customer Account Name",
      "email": "john@example.com",
      "role": "NORMAL_USER",
      "address": "123 Main Street, City, State, Country",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_string"
  },
  "message": "User registered successfully"
}
```

### Login
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe Customer Account Name",
      "email": "john@example.com",
      "role": "NORMAL_USER",
      "address": "123 Main Street, City, State, Country"
    },
    "token": "jwt_token_string"
  },
  "message": "Login successful"
}
```

### Get Current User
**GET** `/auth/me`

Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe Customer Account Name",
      "email": "john@example.com",
      "role": "NORMAL_USER"
    }
  },
  "message": "User retrieved successfully"
}
```

### Update Password
**PUT** `/auth/password`

Update user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password updated successfully"
  },
  "message": "Password updated successfully"
}
```

### Logout
**POST** `/auth/logout`

Logout user (client should remove token).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful. Please remove the token from client storage."
}
```

---

## User Management (Admin Only)

### Get All Users
**GET** `/users`

Get paginated list of users with filtering and sorting.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `name` (string, optional): Filter by name
- `email` (string, optional): Filter by email
- `address` (string, optional): Filter by address
- `role` (string, optional): Filter by role (SYSTEM_ADMIN, STORE_OWNER, NORMAL_USER)
- `sortBy` (string, optional): Sort field (name, email, address, role, createdAt)
- `sortOrder` (string, optional): Sort order (asc, desc)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)

**Example:** `/users?name=john&role=NORMAL_USER&sortBy=createdAt&sortOrder=desc&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "user_id",
        "name": "John Doe Customer Account Name",
        "email": "john@example.com",
        "role": "NORMAL_USER",
        "address": "123 Main Street, City, State, Country",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "ownedStores": [],
        "ratings": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "message": "Users retrieved successfully"
}
```

### Get User by ID
**GET** `/users/:id`

Get detailed user information by ID.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe Customer Account Name",
      "email": "john@example.com",
      "role": "NORMAL_USER",
      "address": "123 Main Street, City, State, Country",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "ownedStores": [],
      "ratings": [
        {
          "id": "rating_id",
          "ratingValue": 5,
          "store": {
            "id": "store_id",
            "name": "Amazing Store Name",
            "address": "456 Store Street, City, State"
          }
        }
      ]
    }
  },
  "message": "User retrieved successfully"
}
```

### Update User
**PUT** `/users/:id`

Update user information.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Updated Name That Is Long Enough",
  "email": "updated@example.com",
  "address": "Updated address",
  "role": "STORE_OWNER"
}
```

### Delete User
**DELETE** `/users/:id`

Delete a user account.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  },
  "message": "User deleted successfully"
}
```

---

## Admin Endpoints

### Get Dashboard Stats
**GET** `/admin/dashboard/stats`

Get platform statistics for admin dashboard.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 25,
      "totalStores": 12,
      "totalRatings": 87
    }
  },
  "message": "Dashboard statistics retrieved successfully"
}
```

### Create User
**POST** `/admin/users`

Create a new user with specified role.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New User Account With Long Name",
  "email": "newuser@example.com",
  "password": "Password123!",
  "address": "123 New User Street, City, State, Country",
  "role": "STORE_OWNER"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "new_user_id",
      "name": "New User Account With Long Name",
      "email": "newuser@example.com",
      "role": "STORE_OWNER",
      "address": "123 New User Street, City, State, Country",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  },
  "message": "User created successfully"
}
```

---

## Store Endpoints

### Get All Stores
**GET** `/stores`

Get paginated list of stores with filtering and sorting.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `name` (string, optional): Filter by store name
- `address` (string, optional): Filter by address
- `sortBy` (string, optional): Sort field (name, address, avgRating, createdAt)
- `sortOrder` (string, optional): Sort order (asc, desc)
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "store_id",
        "name": "Amazing Electronics Store",
        "address": "123 Store Street, Shopping District, City",
        "avgRating": 4.2,
        "owner": {
          "id": "owner_id",
          "name": "Store Owner Full Name Account",
          "email": "owner@example.com"
        },
        "userRating": 5,
        "totalRatings": 15
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 8,
      "totalPages": 1
    }
  },
  "message": "Stores retrieved successfully"
}
```

### Get Store by ID
**GET** `/stores/:id`

Get detailed store information including ratings.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "store": {
      "id": "store_id",
      "name": "Amazing Electronics Store",
      "address": "123 Store Street, Shopping District, City",
      "avgRating": 4.2,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "owner": {
        "id": "owner_id",
        "name": "Store Owner Full Name Account",
        "email": "owner@example.com"
      },
      "userRating": 5,
      "totalRatings": 15,
      "ratings": [
        {
          "id": "rating_id",
          "ratingValue": 5,
          "createdAt": "2023-01-01T00:00:00.000Z",
          "user": {
            "id": "user_id",
            "name": "Customer Name Account"
          }
        }
      ]
    }
  },
  "message": "Store retrieved successfully"
}
```

### Create Store (Admin Only)
**POST** `/stores`

Create a new store.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Amazing Store",
  "address": "456 New Store Avenue, Business District, City, State, Country",
  "ownerId": "store_owner_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "store": {
      "id": "new_store_id",
      "name": "New Amazing Store",
      "address": "456 New Store Avenue, Business District, City, State, Country",
      "avgRating": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "owner": {
        "id": "store_owner_user_id",
        "name": "Store Owner Full Name Account",
        "email": "owner@example.com"
      }
    }
  },
  "message": "Store created successfully"
}
```

### Update Store (Admin Only)
**PUT** `/stores/:id`

Update store information.

**Headers:** `Authorization: Bearer <admin_token>`

### Delete Store (Admin Only)
**DELETE** `/stores/:id`

Delete a store.

**Headers:** `Authorization: Bearer <admin_token>`

### Get My Stores (Store Owner Only)
**GET** `/stores/owner/me`

Get stores owned by the authenticated store owner.

**Headers:** `Authorization: Bearer <store_owner_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": "store_id",
        "name": "My Amazing Store",
        "address": "123 My Store Street, Business District, City",
        "avgRating": 4.5,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "totalRatings": 20,
        "ratings": [
          {
            "id": "rating_id",
            "ratingValue": 5,
            "createdAt": "2023-01-01T00:00:00.000Z",
            "user": {
              "id": "user_id",
              "name": "Customer Name Account",
              "email": "customer@example.com"
            }
          }
        ]
      }
    ]
  },
  "message": "Owner stores retrieved successfully"
}
```

---

## Rating Endpoints

### Create or Update Rating
**POST** `/ratings`

Create a new rating or update existing rating for a store.

**Headers:** `Authorization: Bearer <normal_user_token>`

**Request Body:**
```json
{
  "storeId": "store_id",
  "ratingValue": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rating": {
      "id": "rating_id",
      "ratingValue": 5,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "store": {
        "id": "store_id",
        "name": "Amazing Electronics Store",
        "address": "123 Store Street, Shopping District, City"
      }
    }
  },
  "message": "Rating submitted successfully"
}
```

### Get My Ratings
**GET** `/ratings/me`

Get all ratings submitted by the authenticated user.

**Headers:** `Authorization: Bearer <normal_user_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "id": "rating_id",
        "ratingValue": 5,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "store": {
          "id": "store_id",
          "name": "Amazing Electronics Store",
          "address": "123 Store Street, Shopping District, City",
          "avgRating": 4.2
        }
      }
    ]
  },
  "message": "User ratings retrieved successfully"
}
```

### Get Store Ratings
**GET** `/ratings/store/:storeId`

Get all ratings for a specific store.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "id": "rating_id",
        "ratingValue": 5,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "user": {
          "id": "user_id",
          "name": "Customer Name Account"
        }
      }
    ]
  },
  "message": "Store ratings retrieved successfully"
}
```

### Get Rating Statistics
**GET** `/ratings/store/:storeId/stats`

Get rating statistics for a store.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRatings": 25,
      "avgRating": 4.2,
      "distribution": {
        "1": 1,
        "2": 2,
        "3": 5,
        "4": 7,
        "5": 10
      }
    }
  },
  "message": "Rating statistics retrieved successfully"
}
```

### Delete Rating
**DELETE** `/ratings/store/:storeId`

Delete user's rating for a specific store.

**Headers:** `Authorization: Bearer <normal_user_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Rating deleted successfully"
  },
  "message": "Rating deleted successfully"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Name must be at least 20 characters long",
    "Password must contain at least one uppercase letter and one special character"
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "error": "Access denied. Insufficient permissions."
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Record not found."
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15-minute window per IP
- Exceeding the limit returns HTTP 429 with message: "Too many requests from this IP, please try again later."

## Security Headers

The API includes security headers via Helmet.js:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- And more security headers

## CORS Configuration

CORS is configured to allow requests from the frontend URL specified in environment variables.
