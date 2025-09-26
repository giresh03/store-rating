import { prisma } from '../config/database';
import { StoreFilters, SortOptions, PaginationOptions, CreateStoreRequest } from '../types';

export class StoreService {
  static async getAllStores(
    filters: StoreFilters = {},
    sort: SortOptions = { field: 'createdAt', order: 'desc' },
    pagination: PaginationOptions = { page: 1, limit: 10 },
    userId?: string
  ) {
    const { name, address } = filters;
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }

    const orderBy: any = {};
    orderBy[sort.field] = sort.order;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          address: true,
          avgRating: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          ratings: userId ? {
            where: { userId },
            select: {
              ratingValue: true,
            },
          } : false,
          _count: {
            select: {
              ratings: true,
            },
          },
        },
      }),
      prisma.store.count({ where }),
    ]);

    // Transform stores to include user's rating if userId provided
    const transformedStores = stores.map(store => ({
      ...store,
      userRating: userId && store.ratings && store.ratings.length > 0 
        ? store.ratings[0].ratingValue 
        : null,
      ratings: undefined, // Remove ratings array from response
      totalRatings: store._count.ratings,
      _count: undefined, // Remove _count from response
    }));

    return {
      stores: transformedStores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getStoreById(id: string, userId?: string) {
    const store = await prisma.store.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        avgRating: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
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
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    // Find user's rating if userId provided
    const userRating = userId 
      ? store.ratings.find(rating => rating.user.id === userId)?.ratingValue || null
      : null;

    return {
      ...store,
      userRating,
      totalRatings: store._count.ratings,
      _count: undefined,
    };
  }

  static async createStore(storeData: CreateStoreRequest) {
    const { name, address, ownerId } = storeData;

    // Verify owner exists and is a store owner
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      throw new Error('Store owner not found');
    }

    if (owner.role !== 'STORE_OWNER') {
      throw new Error('User must be a store owner to own a store');
    }

    const store = await prisma.store.create({
      data: {
        name,
        address,
        ownerId,
      },
      select: {
        id: true,
        name: true,
        address: true,
        avgRating: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return store;
  }

  static async updateStore(id: string, storeData: Partial<CreateStoreRequest>) {
    const store = await prisma.store.update({
      where: { id },
      data: storeData,
      select: {
        id: true,
        name: true,
        address: true,
        avgRating: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return store;
  }

  static async deleteStore(id: string) {
    await prisma.store.delete({
      where: { id },
    });

    return { message: 'Store deleted successfully' };
  }

  static async getStoresByOwner(ownerId: string) {
    const stores = await prisma.store.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        address: true,
        avgRating: true,
        createdAt: true,
        ratings: {
          select: {
            id: true,
            ratingValue: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    return stores.map(store => ({
      ...store,
      totalRatings: store._count.ratings,
      _count: undefined,
    }));
  }

  static async updateStoreRating(storeId: string) {
    // Calculate average rating
    const result = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { ratingValue: true },
    });

    const avgRating = result._avg.ratingValue || 0;

    // Update store's average rating
    await prisma.store.update({
      where: { id: storeId },
      data: { avgRating: Math.round(avgRating * 100) / 100 }, // Round to 2 decimal places
    });

    return avgRating;
  }
}
