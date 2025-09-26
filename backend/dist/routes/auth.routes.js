"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const auth_1 = require("../middleware/auth");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
exports.authRoutes = router;
// Register
router.post('/register', (0, schemas_1.validate)(schemas_1.registerSchema), async (req, res, next) => {
    try {
        const result = await auth_service_1.AuthService.register(req.body);
        res.status(201).json({
            success: true,
            data: result,
            message: 'User registered successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Login
router.post('/login', (0, schemas_1.validate)(schemas_1.loginSchema), async (req, res, next) => {
    try {
        const result = await auth_service_1.AuthService.login(req.body);
        res.status(200).json({
            success: true,
            data: result,
            message: 'Login successful',
        });
    }
    catch (error) {
        next(error);
    }
});
// Update password
router.put('/password', auth_1.authenticate, (0, schemas_1.validate)(schemas_1.updatePasswordSchema), async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await auth_service_1.AuthService.updatePassword(req.user.id, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            data: result,
            message: 'Password updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get current user
router.get('/me', auth_1.authenticate, async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: { user: req.user },
            message: 'User retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Logout (client-side token removal)
router.post('/logout', auth_1.authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful. Please remove the token from client storage.',
    });
});
//# sourceMappingURL=auth.routes.js.map