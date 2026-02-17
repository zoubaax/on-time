import { supabase, supabaseAdmin } from '../config/database.js';

/**
 * User Model - Handles all database operations for users
 */
class UserModel {
    /**
     * Find user by ID
     * @param {String} id - User ID
     * @returns {Object|null} User object or null
     */
    static async findById(id) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error finding user by ID:', error.message);
            return null;
        }
    }

    /**
     * Find user by email
     * @param {String} email - User email
     * @returns {Object|null} User object or null
     */
    static async findByEmail(email) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error finding user by email:', error.message);
            return null;
        }
    }

    /**
     * Create new user
     * @param {Object} userData - User data
     * @returns {Object|null} Created user or null
     */
    static async create(userData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .insert([{
                    email: userData.email,
                    full_name: userData.full_name,
                    avatar_url: userData.avatar_url,
                    role: userData.role || 'user',
                    provider: userData.provider || 'google',
                    provider_id: userData.provider_id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating user:', error.message);
            return null;
        }
    }

    /**
     * Update user
     * @param {String} id - User ID
     * @param {Object} updates - Fields to update
     * @returns {Object|null} Updated user or null
     */
    static async update(id, updates) {
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating user:', error.message);
            return null;
        }
    }

    /**
     * Delete user
     * @param {String} id - User ID
     * @returns {Boolean} Success status
     */
    static async delete(id) {
        try {
            const { error } = await supabaseAdmin
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting user:', error.message);
            return false;
        }
    }

    /**
     * Get all users (admin only)
     * @param {Object} filters - Optional filters
     * @returns {Array} Array of users
     */
    static async findAll(filters = {}) {
        try {
            let query = supabaseAdmin.from('users').select('*');

            if (filters.role) {
                query = query.eq('role', filters.role);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching users:', error.message);
            return [];
        }
    }

    /**
     * Update user role (admin only)
     * @param {String} id - User ID
     * @param {String} role - New role (admin/user)
     * @returns {Object|null} Updated user or null
     */
    static async updateRole(id, role) {
        if (!['admin', 'user'].includes(role)) {
            throw new Error('Invalid role. Must be "admin" or "user"');
        }

        return await this.update(id, { role });
    }
}

export default UserModel;
