import { Router } from 'express';
import { StoreService } from '../services/store.service';
import { authenticate, requireAdmin, requireStoreOwner } from '../middleware/auth';
import { validate, validateQuery, createStoreSchema, storeFiltersSchema } from '../validation/schemas';
import { AuthenticatedRequest } from '../types';
import { UserRole } from '@prisma/client';

const router = Router();

// Get all stores (Public for normal users, filtered for store owners)
router.get('/', authenticate, validateQuery(storeFiltersSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const filters = {
      name: req.query.name as string,
      address: req.query.address as string,
    };

    const sort = {
      field: (req.query.sortBy as string) || 'createdAt',
      order: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    // For normal users, include their ratings
    const userId = req.user!.role === UserRole.NORMAL_USER ? req.user!.id : undefined;

    const result = await StoreService.getAllStores(filters, sort, pagination, userId);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Stores retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Get store by ID
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.role === UserRole.NORMAL_USER ? req.user!.id : undefined;
    const store = await StoreService.getStoreById(req.params.id, userId);
    res.status(200).json({
      success: true,
      data: { store },
      message: 'Store retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Create store (Admin only)
router.post('/', authenticate, requireAdmin, validate(createStoreSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const store = await StoreService.createStore(req.body);
    res.status(201).json({
      success: true,
      data: { store },
      message: 'Store created successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Update store (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const store = await StoreService.updateStore(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: { store },
      message: 'Store updated successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Delete store (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await StoreService.deleteStore(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Store deleted successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Get stores by owner (Store Owner only - their own stores)
router.get('/owner/me', authenticate, requireStoreOwner, async (req: AuthenticatedRequest, res, next) => {
  try {
    const stores = await StoreService.getStoresByOwner(req.user!.id);
    res.status(200).json({
      success: true,
      data: { stores },
      message: 'Owner stores retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

export { router as storeRoutes };
