import { prisma } from '../config/database';
import { RatingRequest } from '../types';
import { StoreService } from './store.service';

export class RatingService {
  static async createOrUpdateRating(userId: string, ratingData: RatingRequest) {
    const { storeId, ratingValue } = ratingData;

    // Verify store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    // Check if user already rated this store
    const existingRating = await prisma.rating.findUnique({
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
      rating = await prisma.rating.update({
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
    } else {
      // Create new rating
      rating = await prisma.rating.create({
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
    await StoreService.updateStoreRating(storeId);

    return rating;
  }

  static async getUserRatings(userId: string) {
    const ratings = await prisma.rating.findMany({
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

  static async getStoreRatings(storeId: string) {
    const ratings = await prisma.rating.findMany({
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

  static async deleteRating(userId: string, storeId: string) {
    const rating = await prisma.rating.findUnique({
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

    await prisma.rating.delete({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    // Update store's average rating
    await StoreService.updateStoreRating(storeId);

    return { message: 'Rating deleted successfully' };
  }

  static async getRatingStats(storeId: string) {
    const stats = await prisma.rating.groupBy({
      by: ['ratingValue'],
      where: { storeId },
      _count: { ratingValue: true },
    });

    const totalRatings = await prisma.rating.count({
      where: { storeId },
    });

    const avgRating = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { ratingValue: true },
    });

    return {
      totalRatings,
      avgRating: avgRating._avg.ratingValue || 0,
      distribution: stats.reduce((acc, stat) => {
        acc[stat.ratingValue] = stat._count.ratingValue;
        return acc;
      }, {} as Record<number, number>),
    };
  }
}
