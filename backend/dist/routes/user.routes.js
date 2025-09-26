"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_service_1 = require("../services/user.service");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// Get all users (Admin only)
router.get('/', auth_1.authenticate, auth_1.requireAdmin, (0, schemas_1.validateQuery)(schemas_1.userFiltersSchema), async (req, res, next) => {
    try {
        const filters = {
            name: req.query.name,
            email: req.query.email,
            address: req.query.address,
            role: req.query.role,
        };
        const sort = {
            field: req.query.sortBy || 'createdAt',
            order: req.query.sortOrder || 'desc',
        };
        const pagination = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        };
        const result = await user_service_1.UserService.getAllUsers(filters, sort, pagination);
        res.status(200).json({
            success: true,
            data: result,
            message: 'Users retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get user by ID (Admin only)
router.get('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res, next) => {
    try {
        const user = await user_service_1.UserService.getUserById(req.params.id);
        res.status(200).json({
            success: true,
            data: { user },
            message: 'User retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Update user (Admin only)
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res, next) => {
    try {
        const user = await user_service_1.UserService.updateUser(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: { user },
            message: 'User updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Delete user (Admin only)
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res, next) => {
    try {
        const result = await user_service_1.UserService.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            data: result,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=user.routes.js.map