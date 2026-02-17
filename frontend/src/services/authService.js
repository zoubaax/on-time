/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import axios from '../lib/axios';
import { supabase } from '../config/supabase';
import API_ENDPOINTS from '../config/api';

class AuthService {
    /**
     * Initiate Google OAuth sign in
     */
    async signInWithGoogle() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Google sign in error:', error);
            throw error;
        }
    }

    /**
     * Sign up with Email/Password
     */
    async signUp(email, password, fullName) {
        try {
            const response = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, {
                email,
                password,
                full_name: fullName
            });

            const { user, tokens } = response.data.data;
            if (tokens) {
                this.setTokens(tokens);
                this.setUser(user);
            }

            return response.data;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    }

    /**
     * Sign in with Email/Password
     */
    async signIn(email, password) {
        try {
            const response = await axios.post(API_ENDPOINTS.AUTH.SIGNIN, {
                email,
                password
            });

            const { user, tokens } = response.data.data;
            this.setTokens(tokens);
            this.setUser(user);

            return user;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    /**
     * Handle OAuth callback
     */
    async handleOAuthCallback() {
        try {
            // Get session from Supabase
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;
            if (!session) throw new Error('No session found');

            // Send tokens to backend
            const response = await axios.post(API_ENDPOINTS.AUTH.CALLBACK, {
                access_token: session.access_token,
                refresh_token: session.refresh_token,
            });

            const { user, tokens } = response.data.data;

            // Store tokens and user
            this.setTokens(tokens);
            this.setUser(user);

            return { user, tokens };
        } catch (error) {
            console.error('OAuth callback error:', error);
            throw error;
        }
    }

    /**
     * Get current user profile
     */
    async getProfile() {
        try {
            const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE);
            const user = response.data.data.user;
            this.setUser(user);
            return user;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(updates) {
        try {
            const response = await axios.patch(API_ENDPOINTS.USERS.PROFILE, updates);
            const user = response.data.data.user;
            this.setUser(user);
            return user;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }

    /**
     * Sign out
     */
    async signOut() {
        try {
            await axios.post(API_ENDPOINTS.AUTH.SIGNOUT);
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            this.clearAuth();
            await supabase.auth.signOut();
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token');

            const response = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
                refreshToken,
            });

            const tokens = response.data.data.tokens;
            this.setTokens(tokens);
            return tokens.accessToken;
        } catch (error) {
            console.error('Refresh token error:', error);
            this.clearAuth();
            throw error;
        }
    }

    // Token management
    setTokens(tokens) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
    }

    getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    clearAuth() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.getAccessToken();
    }

    isAdmin() {
        const user = this.getUser();
        return user?.role === 'admin';
    }
}

export default new AuthService();
