import { Router } from 'express';
import { UserService } from '../services/user.service';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateQuery, userFiltersSchema } from '../validation/schemas';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Get all users (Admin only)
router.get('/', authenticate, requireAdmin, validateQuery(userFiltersSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const filters = {
      name: req.query.name as string,
      email: req.query.email as string,
      address: req.query.address as string,
      role: req.query.role as any,
    };

    const sort = {
      field: (req.query.sortBy as string) || 'createdAt',
      order: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await UserService.getAllUsers(filters, sort, pagination);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Users retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Get user by ID (Admin only)
router.get('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: { user },
      message: 'User retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Update user (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: { user },
      message: 'User updated successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await UserService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

export { router as userRoutes };
