export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  NORMAL_USER = 'NORMAL_USER',
  STORE_OWNER = 'STORE_OWNER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  address: string;
  createdAt: string;
  ownedStores?: Store[];
  ratings?: Rating[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  avgRating: number;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  userRating?: number | null;
  totalRatings?: number;
  ratings?: Rating[];
  createdAt?: string;
}

export interface Rating {
  id: string;
  ratingValue: number;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email?: string;
  };
  store?: {
    id: string;
    name: string;
    address: string;
    avgRating?: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  address: string;
}

export interface CreateUserRequest extends RegisterRequest {
  role: UserRole;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateStoreRequest {
  name: string;
  address: string;
  ownerId: string;
}

export interface RatingRequest {
  storeId: string;
  ratingValue: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface UserFilters {
  name?: string;
  email?: string;
  address?: string;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface StoreFilters {
  name?: string;
  address?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
