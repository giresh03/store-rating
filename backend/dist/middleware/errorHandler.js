"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    // Prisma errors
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return res.status(400).json({
                    success: false,
                    error: 'A record with this information already exists.',
                });
            case 'P2025':
                return res.status(404).json({
                    success: false,
                    error: 'Record not found.',
                });
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Database operation failed.',
                });
        }
    }
    // Validation errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token.',
        });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token expired.',
        });
    }
    // Default error
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map