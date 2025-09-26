import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { authenticate } from '../middleware/auth';
import { validate, loginSchema, registerSchema, updatePasswordSchema } from '../validation/schemas';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  } catch (error: any) {
    next(error);
  }
});

// Update password
router.put('/password', authenticate, validate(updatePasswordSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await AuthService.updatePassword(req.user!.id, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Password updated successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: { user: req.user },
      message: 'User retrieved successfully',
    });
  } catch (error: any) {
    next(error);
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticate, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.',
  });
});

export { router as authRoutes };
