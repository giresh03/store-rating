"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = require("../utils/bcrypt");
class UserService {
    static async getAllUsers(filters = {}, sort = { field: 'createdAt', order: 'desc' }, pagination = { page: 1, limit: 10 }) {
        const { name, email, address, role } = filters;
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;
        const where = {};
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
        const orderBy = {};
        orderBy[sort.field] = sort.order;
        const [users, total] = await Promise.all([
            database_1.prisma.user.findMany({
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
            database_1.prisma.user.count({ where }),
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
    static async getUserById(id) {
        const user = await database_1.prisma.user.findUnique({
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
    static async createUser(userData) {
        const { name, email, password, address, role } = userData;
        // Check if user already exists
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        // Create user
        const user = await database_1.prisma.user.create({
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
    static async updateUser(id, userData) {
        const { password, ...updateData } = userData;
        // If password is being updated, hash it
        if (password) {
            updateData.password = await (0, bcrypt_1.hashPassword)(password);
        }
        const user = await database_1.prisma.user.update({
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
    static async deleteUser(id) {
        await database_1.prisma.user.delete({
            where: { id },
        });
        return { message: 'User deleted successfully' };
    }
    static async getDashboardStats() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            database_1.prisma.user.count(),
            database_1.prisma.store.count(),
            database_1.prisma.rating.count(),
        ]);
        return {
            totalUsers,
            totalStores,
            totalRatings,
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map