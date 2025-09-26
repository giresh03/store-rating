"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrNormalUser = exports.requireAdminOrStoreOwner = exports.requireNormalUser = exports.requireStoreOwner = exports.requireAdmin = exports.authorize = exports.authenticate = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid token.'
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. User not authenticated.'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};
exports.authorize = authorize;
// Middleware to check if user is admin
exports.requireAdmin = (0, exports.authorize)(client_1.UserRole.SYSTEM_ADMIN);
// Middleware to check if user is store owner
exports.requireStoreOwner = (0, exports.authorize)(client_1.UserRole.STORE_OWNER);
// Middleware to check if user is normal user
exports.requireNormalUser = (0, exports.authorize)(client_1.UserRole.NORMAL_USER);
// Middleware to check if user is admin or store owner
exports.requireAdminOrStoreOwner = (0, exports.authorize)(client_1.UserRole.SYSTEM_ADMIN, client_1.UserRole.STORE_OWNER);
// Middleware to check if user is admin or normal user
exports.requireAdminOrNormalUser = (0, exports.authorize)(client_1.UserRole.SYSTEM_ADMIN, client_1.UserRole.NORMAL_USER);
//# sourceMappingURL=auth.js.map