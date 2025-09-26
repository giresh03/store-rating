import { prisma } from '../config/database';
import { UserFilters, SortOptions, PaginationOptions, CreateUserRequest } from '../types';
import { hashPassword } from '../utils/bcrypt';
import { UserRole } from '@prisma/client';

export class UserService {
  static async getAllUsers(
    filters: UserFilters = {},
    sort: SortOptions = { field: 'createdAt', order: 'desc' },
    pagination: PaginationOptions = { page: 1, limit: 10 }
  ) {
    const { name, email, address, role } = filters;
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
    if (address) {
      where.address = { contains: address, mode: 'insensitive' };
    }
    if (role) {
      where.role = role;
    }

    const orderBy: any = {};
    orderBy[sort.field] = sort.order;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          address: true,
          createdAt: true,
          ownedStores: {
            select: {
              id: true,
              name: true,
              avgRating: true,
            },
          },
          ratings: {
            select: {
              id: true,
              ratingValue: true,
              store: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
        ownedStores: {
          select: {
            id: true,
            name: true,
            address: true,
            avgRating: true,
            ratings: {
              select: {
                id: true,
                ratingValue: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        ratings: {
          select: {
            id: true,
            ratingValue: true,
            store: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async createUser(userData: CreateUserRequest) {
    const { name, email, password, address, role } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    return user;
  }

  static async updateUser(id: string, userData: Partial<CreateUserRequest>) {
    const { password, ...updateData } = userData;

    // If password is being updated, hash it
    if (password) {
      (updateData as any).password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  static async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }
}
