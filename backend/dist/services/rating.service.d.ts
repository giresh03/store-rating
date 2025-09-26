import { RatingRequest } from '../types';
export declare class RatingService {
    static createOrUpdateRating(userId: string, ratingData: RatingRequest): Promise<{
        store: {
            name: string;
            address: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ratingValue: number;
    }>;
    static getUserRatings(userId: string): Promise<{
        store: {
            name: string;
            address: string;
            id: string;
            avgRating: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ratingValue: number;
    }[]>;
    static getStoreRatings(storeId: string): Promise<{
        user: {
            name: string;
            id: string;
        };
        id: string;
        createdAt: Date;
        ratingValue: number;
    }[]>;
    static deleteRating(userId: string, storeId: string): Promise<{
        message: string;
    }>;
    static getRatingStats(storeId: string): Promise<{
        totalRatings: number;
        avgRating: number;
        distribution: Record<number, number>;
    }>;
}
//# sourceMappingURL=rating.service.d.ts.map