"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validate = exports.storeFiltersSchema = exports.userFiltersSchema = exports.ratingSchema = exports.createStoreSchema = exports.updatePasswordSchema = exports.createUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
// Password validation: 8-16 chars, must include uppercase + special char
const passwordSchema = joi_1.default.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .required()
    .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter and one special character',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not exceed 16 characters',
});
// Name validation: 20-60 chars
const nameSchema = joi_1.default.string()
    .min(20)
    .max(60)
    .trim()
    .required()
    .messages({
    'string.min': 'Name must be at least 20 characters long',
    'string.max': 'Name must not exceed 60 characters',
});
// Address validation: Max 400 chars
const addressSchema = joi_1.default.string()
    .max(400)
    .trim()
    .required()
    .messages({
    'string.max': 'Address must not exceed 400 characters',
});
// Email validation
const emailSchema = joi_1.default.string()
    .email()
    .required()
    .messages({
    'string.email': 'Please provide a valid email address',
});
// User registration schema
exports.registerSchema = joi_1.default.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    address: addressSchema,
});
// User login schema
exports.loginSchema = joi_1.default.object({
    email: emailSchema,
    password: joi_1.default.string().required(),
});
// Create user schema (for admin)
exports.createUserSchema = joi_1.default.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    address: addressSchema,
    role: joi_1.default.string().valid(...Object.values(client_1.UserRole)).required(),
});
// Update password schema
exports.updatePasswordSchema = joi_1.default.object({
    currentPassword: joi_1.default.string().required(),
    newPassword: passwordSchema,
});
// Create store schema
exports.createStoreSchema = joi_1.default.object({
    name: joi_1.default.string().min(1).max(100).trim().required(),
    address: addressSchema,
    ownerId: joi_1.default.string().required(),
});
// Rating schema
exports.ratingSchema = joi_1.default.object({
    storeId: joi_1.default.string().required(),
    ratingValue: joi_1.default.number().integer().min(1).max(5).required(),
});
// User filters schema
exports.userFiltersSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    email: joi_1.default.string().email().optional(),
    address: joi_1.default.string().optional(),
    role: joi_1.default.string().valid(...Object.values(client_1.UserRole)).optional(),
    sortBy: joi_1.default.string().valid('name', 'email', 'address', 'role', 'createdAt').optional(),
    sortOrder: joi_1.default.string().valid('asc', 'desc').optional(),
    page: joi_1.default.number().integer().min(1).optional(),
    limit: joi_1.default.number().integer().min(1).max(100).optional(),
});
// Store filters schema
exports.storeFiltersSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    address: joi_1.default.string().optional(),
    sortBy: joi_1.default.string().valid('name', 'address', 'avgRating', 'createdAt').optional(),
    sortOrder: joi_1.default.string().valid('asc', 'desc').optional(),
    page: joi_1.default.number().integer().min(1).optional(),
    limit: joi_1.default.number().integer().min(1).max(100).optional(),
});
// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errorMessages,
            });
        }
        next();
    };
};
exports.validate = validate;
// Query validation middleware
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                error: 'Query validation failed',
                details: errorMessages,
            });
        }
        next();
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=schemas.js.map