import { Router } from 'express';
import { UserService } from '../services/user.service';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate, createUserSchema } from '../validation/schemas';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Get dashboard statistics (Admin only)
router.get('/dashboard/stats', authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const stats = await UserService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: { stats },
      message: 'Dashboard statistics retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Create user (Admin only)
router.post('/users', authenticate, requireAdmin, validate(createUserSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: { user },
      message: 'User created successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

export { router as adminRoutes };
