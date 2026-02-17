import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
    validateOAuthCallback,
    validateRefreshToken
} from '../middlewares/validation.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth sign up
 * @access  Public
 */
router.get('/google', AuthController.signUpWithGoogle);

/**
 * @route   GET /api/auth/google/signin
 * @desc    Initiate Google OAuth sign in
 * @access  Public
 */
router.get('/google/signin', AuthController.signInWithGoogle);

/**
 * @route   POST /api/auth/callback
 * @desc    Handle OAuth callback
 * @access  Public
 */
router.post('/callback', validateOAuthCallback, AuthController.handleOAuthCallback);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', validateRefreshToken, AuthController.refreshToken);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @route   POST /api/auth/signout
 * @desc    Sign out user
 * @access  Private
 */
router.post('/signout', authenticate, AuthController.signOut);

export default router;
