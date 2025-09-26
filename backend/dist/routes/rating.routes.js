"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingRoutes = void 0;
const express_1 = require("express");
const rating_service_1 = require("../services/rating.service");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
exports.ratingRoutes = router;
// Create or update rating (Normal users only)
router.post('/', auth_1.authenticate, auth_1.requireNormalUser, (0, schemas_1.validate)(schemas_1.ratingSchema), async (req, res, next) => {
    try {
        const rating = await rating_service_1.RatingService.createOrUpdateRating(req.user.id, req.body);
        res.status(201).json({
            success: true,
            data: { rating },
            message: 'Rating submitted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get user's ratings (Normal users only)
router.get('/me', auth_1.authenticate, auth_1.requireNormalUser, async (req, res, next) => {
    try {
        const ratings = await rating_service_1.RatingService.getUserRatings(req.user.id);
        res.status(200).json({
            success: true,
            data: { ratings },
            message: 'User ratings retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get store ratings
router.get('/store/:storeId', auth_1.authenticate, async (req, res, next) => {
    try {
        const ratings = await rating_service_1.RatingService.getStoreRatings(req.params.storeId);
        res.status(200).json({
            success: true,
            data: { ratings },
            message: 'Store ratings retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get rating statistics for a store
router.get('/store/:storeId/stats', auth_1.authenticate, async (req, res, next) => {
    try {
        const stats = await rating_service_1.RatingService.getRatingStats(req.params.storeId);
        res.status(200).json({
            success: true,
            data: { stats },
            message: 'Rating statistics retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Delete rating (Normal users only)
router.delete('/store/:storeId', auth_1.authenticate, auth_1.requireNormalUser, async (req, res, next) => {
    try {
        const result = await rating_service_1.RatingService.deleteRating(req.user.id, req.params.storeId);
        res.status(200).json({
            success: true,
            data: result,
            message: 'Rating deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=rating.routes.js.map