import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token.' 
    });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

// Middleware to check if user is admin
export const requireAdmin = authorize(UserRole.SYSTEM_ADMIN);

// Middleware to check if user is store owner
export const requireStoreOwner = authorize(UserRole.STORE_OWNER);

// Middleware to check if user is normal user
export const requireNormalUser = authorize(UserRole.NORMAL_USER);

// Middleware to check if user is admin or store owner
export const requireAdminOrStoreOwner = authorize(UserRole.SYSTEM_ADMIN, UserRole.STORE_OWNER);

// Middleware to check if user is admin or normal user
export const requireAdminOrNormalUser = authorize(UserRole.SYSTEM_ADMIN, UserRole.NORMAL_USER);
