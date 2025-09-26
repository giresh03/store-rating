"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
class AuthService {
    static async register(userData) {
        const { name, email, password, address } = userData;
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
                role: 'NORMAL_USER',
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
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        });
        return { user, token };
    }
    static async login(loginData) {
        const { email, password } = loginData;
        // Find user
        const user = await database_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isPasswordValid = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        });
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    static async updatePassword(userId, currentPassword, newPassword) {
        // Get user with password
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Verify current password
        const isCurrentPasswordValid = await (0, bcrypt_1.comparePassword)(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        // Hash new password
        const hashedNewPassword = await (0, bcrypt_1.hashPassword)(newPassword);
        // Update password
        await database_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        return { message: 'Password updated successfully' };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map