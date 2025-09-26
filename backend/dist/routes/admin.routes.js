"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const user_service_1 = require("../services/user.service");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
exports.adminRoutes = router;
// Get dashboard statistics (Admin only)
router.get('/dashboard/stats', auth_1.authenticate, auth_1.requireAdmin, async (req, res, next) => {
    try {
        const stats = await user_service_1.UserService.getDashboardStats();
        res.status(200).json({
            success: true,
            data: { stats },
            message: 'Dashboard statistics retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Create user (Admin only)
router.post('/users', auth_1.authenticate, auth_1.requireAdmin, (0, schemas_1.validate)(schemas_1.createUserSchema), async (req, res, next) => {
    try {
        const user = await user_service_1.UserService.createUser(req.body);
        res.status(201).json({
            success: true,
            data: { user },
            message: 'User created successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=admin.routes.js.map