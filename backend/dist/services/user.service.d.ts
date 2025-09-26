import { UserFilters, SortOptions, PaginationOptions, CreateUserRequest } from '../types';
export declare class UserService {
    static getAllUsers(filters?: UserFilters, sort?: SortOptions, pagination?: PaginationOptions): Promise<{
        users: {
            name: string;
            email: string;
            address: string;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            ownedStores: {
                name: string;
                id: string;
                avgRating: number;
            }[];
            ratings: {
                store: {
                    name: string;
                    id: string;
                };
                id: string;
                ratingValue: number;
            }[];
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getUserById(id: string): Promise<{
        name: string;
        email: string;
        address: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        ownedStores: {
            name: string;
            address: string;
            id: string;
            ratings: {
                user: {
                    name: string;
                    email: string;
                    id: string;
                };
                id: string;
                ratingValue: number;
            }[];
            avgRating: number;
        }[];
        ratings: {
            store: {
                name: string;
                address: string;
                id: string;
            };
            id: string;
            ratingValue: number;
        }[];
    }>;
    static createUser(userData: CreateUserRequest): Promise<{
        name: string;
        email: string;
        address: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    static updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<{
        name: string;
        email: string;
        address: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        updatedAt: Date;
    }>;
    static deleteUser(id: string): Promise<{
        message: string;
    }>;
    static getDashboardStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map