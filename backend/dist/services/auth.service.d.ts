import { LoginRequest, RegisterRequest } from '../types';
export declare class AuthService {
    static register(userData: RegisterRequest): Promise<{
        user: {
            name: string;
            email: string;
            address: string;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        token: string;
    }>;
    static login(loginData: LoginRequest): Promise<{
        user: {
            name: string;
            email: string;
            address: string;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    static updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map