"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRoutes = void 0;
const express_1 = require("express");
const store_service_1 = require("../services/store.service");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validation/schemas");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
exports.storeRoutes = router;
// Get all stores (Public for normal users, filtered for store owners)
router.get('/', auth_1.authenticate, (0, schemas_1.validateQuery)(schemas_1.storeFiltersSchema), async (req, res, next) => {
    try {
        const filters = {
            name: req.query.name,
            address: req.query.address,
        };
        const sort = {
            field: req.query.sortBy || 'createdAt',
            order: req.query.sortOrder || 'desc',
        };
        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };
        // For normal users, include their ratings
        const userId = req.user.role === client_1.UserRole.NORMAL_USER ? req.user.id : undefined;
        const result = await store_service_1.StoreService.getAllStores(filters, sort, pagination, userId);
        res.status(200).json({
            success: true,
            data: result,
            message: 'Stores retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get store by ID
router.get('/:id', auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user.role === client_1.UserRole.NORMAL_USER ? req.user.id : undefined;
        const store = await store_service_1.StoreService.getStoreById(req.params.id, userId);
        res.status(200).json({
            success: true,
            data: { store },
            message: 'Store retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Create store (Admin only)
router.post('/', auth_1.authenticate, auth_1.requireAdmin, (0, schemas_1.validate)(schemas_1.createStoreSchema), async (req, res, next) => {
    try {
        const store = await store_service_1.StoreService.createStore(req.body);
        res.status(201).json({
            success: true,
            data: { store },
            message: 'Store created successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Update store (Admin only)
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res, next) => {
    try {
        const store = await store_service_1.StoreService.updateStore(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: { store },
            message: 'Store updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Delete store (Admin only)
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res, next) => {
    try {
        const result = await store_service_1.StoreService.deleteStore(req.params.id);
        res.status(200).json({
            success: true,
            data: result,
            message: 'Store deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get stores by owner (Store Owner only - their own stores)
router.get('/owner/me', auth_1.authenticate, auth_1.requireStoreOwner, async (req, res, next) => {
    try {
        const stores = await store_service_1.StoreService.getStoresByOwner(req.user.id);
        res.status(200).json({
            success: true,
            data: { stores },
            message: 'Owner stores retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=store.routes.js.map