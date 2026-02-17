import express from 'express';
import UserController from '../controllers/user.controller.js';
import { authenticate, adminOnly } from '../middlewares/auth.middleware.js';
import {
    validateUpdateRole,
    validateUpdateProfile,
    validateUserId,
    validateRoleFilter
} from '../middlewares/validation.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/', authenticate, adminOnly, validateRoleFilter, UserController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticate, adminOnly, validateUserId, UserController.getUserById);

/**
 * @route   PATCH /api/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin only)
 */
router.patch('/:id/role', authenticate, adminOnly, validateUpdateRole, UserController.updateUserRole);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, adminOnly, validateUserId, UserController.deleteUser);

/**
 * @route   PATCH /api/users/profile
 * @desc    Update own profile
 * @access  Private
 */
router.patch('/profile/me', authenticate, validateUpdateProfile, UserController.updateProfile);

export default router;
