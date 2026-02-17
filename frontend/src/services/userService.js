/**
 * User Service
 * Handles user management API calls (Admin operations)
 */
import axios from '../lib/axios';
import API_ENDPOINTS from '../config/api';

class UserService {
    /**
     * Get all users (Admin only)
     */
    async getAllUsers(roleFilter = null) {
        try {
            const url = roleFilter
                ? `${API_ENDPOINTS.USERS.BASE}?role=${roleFilter}`
                : API_ENDPOINTS.USERS.BASE;

            const response = await axios.get(url);
            return response.data.data.users;
        } catch (error) {
            console.error('Get all users error:', error);
            throw error;
        }
    }

    /**
     * Get user by ID (Admin only)
     */
    async getUserById(userId) {
        try {
            const response = await axios.get(API_ENDPOINTS.USERS.BY_ID(userId));
            return response.data.data.user;
        } catch (error) {
            console.error('Get user by ID error:', error);
            throw error;
        }
    }

    /**
     * Update user role (Admin only)
     */
    async updateUserRole(userId, role) {
        try {
            const response = await axios.patch(API_ENDPOINTS.USERS.ROLE(userId), { role });
            return response.data.data.user;
        } catch (error) {
            console.error('Update user role error:', error);
            throw error;
        }
    }

    /**
     * Delete user (Admin only)
     */
    async deleteUser(userId) {
        try {
            await axios.delete(API_ENDPOINTS.USERS.BY_ID(userId));
            return true;
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    }
}

export default new UserService();
