import { StoreFilters, SortOptions, PaginationOptions, CreateStoreRequest } from '../types';
export declare class StoreService {
    static getAllStores(filters?: StoreFilters, sort?: SortOptions, pagination?: PaginationOptions, userId?: string): Promise<{
        stores: {
            userRating: number | null;
            ratings: undefined;
            totalRatings: number;
            _count: undefined;
            name: string;
            address: string;
            id: string;
            avgRating: number;
            owner: {
                name: string;
                email: string;
                id: string;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getStoreById(id: string, userId?: string): Promise<{
        userRating: number | null;
        totalRatings: number;
        _count: undefined;
        name: string;
        address: string;
        id: string;
        createdAt: Date;
        ratings: {
            user: {
                name: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            ratingValue: number;
        }[];
        avgRating: number;
        owner: {
            name: string;
            email: string;
            id: string;
        };
    }>;
    static createStore(storeData: CreateStoreRequest): Promise<{
        name: string;
        address: string;
        id: string;
        createdAt: Date;
        avgRating: number;
        owner: {
            name: string;
            email: string;
            id: string;
        };
    }>;
    static updateStore(id: string, storeData: Partial<CreateStoreRequest>): Promise<{
        name: string;
        address: string;
        id: string;
        updatedAt: Date;
        avgRating: number;
        owner: {
            name: string;
            email: string;
            id: string;
        };
    }>;
    static deleteStore(id: string): Promise<{
        message: string;
    }>;
    static getStoresByOwner(ownerId: string): Promise<{
        totalRatings: number;
        _count: undefined;
        name: string;
        address: string;
        id: string;
        createdAt: Date;
        ratings: {
            user: {
                name: string;
                email: string;
                id: string;
            };
            id: string;
            createdAt: Date;
            ratingValue: number;
        }[];
        avgRating: number;
    }[]>;
    static updateStoreRating(storeId: string): Promise<number>;
}
//# sourceMappingURL=store.service.d.ts.map