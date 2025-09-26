import { UserRole } from '@prisma/client';
export interface JWTPayload {
    id: string;
    email: string;
    role: UserRole;
    name: string;
}
export declare const generateToken: (payload: JWTPayload) => string;
export declare const verifyToken: (token: string) => JWTPayload;
//# sourceMappingURL=jwt.d.ts.map