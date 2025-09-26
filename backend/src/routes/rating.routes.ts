import { Router } from 'express';
import { RatingService } from '../services/rating.service';
import { authenticate, requireNormalUser } from '../middleware/auth';
import { validate, ratingSchema } from '../validation/schemas';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Create or update rating (Normal users only)
router.post('/', authenticate, requireNormalUser, validate(ratingSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const rating = await RatingService.createOrUpdateRating(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      data: { rating },
      message: 'Rating submitted successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Get user's ratings (Normal users only)
router.get('/me', authenticate, requireNormalUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const ratings = await RatingService.getUserRatings(req.user!.id);
    res.status(200).json({
      success: true,
      data: { ratings },
      message: 'User ratings retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Get store ratings
router.get('/store/:storeId', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const ratings = await RatingService.getStoreRatings(req.params.storeId);
    res.status(200).json({
      success: true,
      data: { ratings },
      message: 'Store ratings retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Get rating statistics for a store
router.get('/store/:storeId/stats', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const stats = await RatingService.getRatingStats(req.params.storeId);
    res.status(200).json({
      success: true,
      data: { stats },
      message: 'Rating statistics retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Delete rating (Normal users only)
router.delete('/store/:storeId', authenticate, requireNormalUser, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await RatingService.deleteRating(req.user!.id, req.params.storeId);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Rating deleted successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

export { router as ratingRoutes };
