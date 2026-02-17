import UserModel from '../models/User.model.js';

/**
 * User Controller - Handles user management operations
 */
class UserController {
    /**
     * Get all users (Admin only)
     */
    static async getAllUsers(req, res) {
        try {
            const { role } = req.query;
            const filters = role ? { role } : {};

            const users = await UserModel.findAll(filters);

            return res.status(200).json({
                success: true,
                data: {
                    users: users.map(user => ({
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        avatar_url: user.avatar_url,
                        role: user.role,
                        created_at: user.created_at
                    })),
                    count: users.length
                }
            });
        } catch (error) {
            console.error('Get all users error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Get user by ID (Admin only)
     */
    static async getUserById(req, res) {
        try {
            const { id } = req.params;

            const user = await UserModel.findById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        avatar_url: user.avatar_url,
                        role: user.role,
                        created_at: user.created_at,
                        updated_at: user.updated_at
                    }
                }
            });
        } catch (error) {
            console.error('Get user by ID error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Update user role (Admin only)
     */
    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!role || !['admin', 'user'].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role. Must be "admin" or "user"'
                });
            }

            // Prevent admin from changing their own role
            if (id === req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You cannot change your own role'
                });
            }

            const user = await UserModel.updateRole(id, role);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found or update failed'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'User role updated successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            console.error('Update user role error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Delete user (Admin only)
     */
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Prevent admin from deleting themselves
            if (id === req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You cannot delete your own account'
                });
            }

            const success = await UserModel.delete(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found or deletion failed'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Delete user error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Update own profile
     */
    static async updateProfile(req, res) {
        try {
            const { full_name, avatar_url } = req.body;
            const updates = {};

            if (full_name) updates.full_name = full_name;
            if (avatar_url) updates.avatar_url = avatar_url;

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No valid fields to update'
                });
            }

            const user = await UserModel.update(req.user.id, updates);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found or update failed'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        avatar_url: user.avatar_url,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

export default UserController;
