import Joi from 'joi';
import { UserRole } from '@prisma/client';

// Password validation: 8-16 chars, must include uppercase + special char
const passwordSchema = Joi.string()
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
const nameSchema = Joi.string()
  .min(20)
  .max(60)
  .trim()
  .required()
  .messages({
    'string.min': 'Name must be at least 20 characters long',
    'string.max': 'Name must not exceed 60 characters',
  });

// Address validation: Max 400 chars
const addressSchema = Joi.string()
  .max(400)
  .trim()
  .required()
  .messages({
    'string.max': 'Address must not exceed 400 characters',
  });

// Email validation
const emailSchema = Joi.string()
  .email()
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
  });

// User registration schema
export const registerSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
});

// User login schema
export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required(),
});

// Create user schema (for admin)
export const createUserSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: Joi.string().valid(...Object.values(UserRole)).required(),
});

// Update password schema
export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordSchema,
});

// Create store schema
export const createStoreSchema = Joi.object({
  name: Joi.string().min(1).max(100).trim().required(),
  address: addressSchema,
  ownerId: Joi.string().required(),
});

// Rating schema
export const ratingSchema = Joi.object({
  storeId: Joi.string().required(),
  ratingValue: Joi.number().integer().min(1).max(5).required(),
});

// User filters schema
export const userFiltersSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().optional(),
  role: Joi.string().valid(...Object.values(UserRole)).optional(),
  sortBy: Joi.string().valid('name', 'email', 'address', 'role', 'createdAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

// Store filters schema
export const storeFiltersSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  sortBy: Joi.string().valid('name', 'address', 'avgRating', 'createdAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

// Validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
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

// Query validation middleware
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
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
