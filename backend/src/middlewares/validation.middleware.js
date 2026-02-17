import { body, param, query, validationResult } from 'express-validator';

/**
 * Validation error handler
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

/**
 * OAuth callback validation
 */
export const validateOAuthCallback = [
    body('access_token')
        .notEmpty()
        .withMessage('Access token is required')
        .isString()
        .withMessage('Access token must be a string'),
    body('refresh_token')
        .optional()
        .isString()
        .withMessage('Refresh token must be a string'),
    handleValidationErrors
];

/**
 * Refresh token validation
 */
export const validateRefreshToken = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isString()
        .withMessage('Refresh token must be a string'),
    handleValidationErrors
];

/**
 * Update role validation
 */
export const validateUpdateRole = [
    param('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isUUID()
        .withMessage('Invalid user ID format'),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['admin', 'user'])
        .withMessage('Role must be either "admin" or "user"'),
    handleValidationErrors
];

/**
 * Update profile validation
 */
export const validateUpdateProfile = [
    body('full_name')
        .optional()
        .isString()
        .withMessage('Full name must be a string')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('avatar_url')
        .optional()
        .isURL()
        .withMessage('Avatar URL must be a valid URL'),
    handleValidationErrors
];

/**
 * User ID param validation
 */
export const validateUserId = [
    param('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isUUID()
        .withMessage('Invalid user ID format'),
    handleValidationErrors
];

/**
 * Query role filter validation
 */
export const validateRoleFilter = [
    query('role')
        .optional()
        .isIn(['admin', 'user'])
        .withMessage('Role must be either "admin" or "user"'),
    handleValidationErrors
];
