"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const database_1 = require("../config/database");
const store_service_1 = require("./store.service");
class RatingService {
    static async createOrUpdateRating(userId, ratingData) {
        const { storeId, ratingValue } = ratingData;
        // Verify store exists
        const store = await database_1.prisma.store.findUnique({
            where: { id: storeId },
        });
        if (!store) {
            throw new Error('Store not found');
        }
        // Check if user already rated this store
        const existingRating = await database_1.prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
        });
        let rating;
        if (existingRating) {
            // Update existing rating
            rating = await database_1.prisma.rating.update({
                where: {
                    userId_storeId: {
                        userId,
                        storeId,
                    },
                },
                data: { ratingValue },
                select: {
                    id: true,
                    ratingValue: true,
                    createdAt: true,
                    updatedAt: true,
                    store: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                        },
                    },
                },
            });
        }
        else {
            // Create new rating
            rating = await database_1.prisma.rating.create({
                data: {
                    userId,
                    storeId,
                    ratingValue,
                },
                select: {
                    id: true,
                    ratingValue: true,
                    createdAt: true,
                    updatedAt: true,
                    store: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                        },
                    },
                },
            });
        }
        // Update store's average rating
        await store_service_1.StoreService.updateStoreRating(storeId);
        return rating;
    }
    static async getUserRatings(userId) {
        const ratings = await database_1.prisma.rating.findMany({
            where: { userId },
            select: {
                id: true,
                ratingValue: true,
                createdAt: true,
                updatedAt: true,
                store: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        avgRating: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return ratings;
    }
    static async getStoreRatings(storeId) {
        const ratings = await database_1.prisma.rating.findMany({
            where: { storeId },
            select: {
                id: true,
                ratingValue: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return ratings;
    }
    static async deleteRating(userId, storeId) {
        const rating = await database_1.prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
        });
        if (!rating) {
            throw new Error('Rating not found');
        }
        await database_1.prisma.rating.delete({
            where: {
                userId_storeId: {
                    userId,
                    storeId,
                },
            },
        });
        // Update store's average rating
        await store_service_1.StoreService.updateStoreRating(storeId);
        return { message: 'Rating deleted successfully' };
    }
    static async getRatingStats(storeId) {
        const stats = await database_1.prisma.rating.groupBy({
            by: ['ratingValue'],
            where: { storeId },
            _count: { ratingValue: true },
        });
        const totalRatings = await database_1.prisma.rating.count({
            where: { storeId },
        });
        const avgRating = await database_1.prisma.rating.aggregate({
            where: { storeId },
            _avg: { ratingValue: true },
        });
        return {
            totalRatings,
            avgRating: avgRating._avg.ratingValue || 0,
            distribution: stats.reduce((acc, stat) => {
                acc[stat.ratingValue] = stat._count.ratingValue;
                return acc;
            }, {}),
        };
    }
}
exports.RatingService = RatingService;
//# sourceMappingURL=rating.service.js.map