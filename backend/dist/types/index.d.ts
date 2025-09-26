import { Request } from 'express';
import { UserRole } from '@prisma/client';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: UserRole;
        name: string;
    };
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
export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    address: string;
    role: UserRole;
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
export interface UserFilters {
    name?: string;
    email?: string;
    address?: string;
    role?: UserRole;
}
export interface StoreFilters {
    name?: string;
    address?: string;
}
export interface SortOptions {
    field: string;
    order: 'asc' | 'desc';
}
export interface PaginationOptions {
    page: number;
    limit: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface DashboardStats {
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
}
export interface StoreWithRating {
    id: string;
    name: string;
    address: string;
    avgRating: number;
    userRating?: number;
}
//# sourceMappingURL=index.d.ts.map