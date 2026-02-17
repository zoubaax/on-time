import { supabase } from '../config/database.js';
import { generateTokenPair, verifyToken } from '../config/jwt.js';
import UserModel from '../models/User.model.js';

/**
 * Auth Controller - Handles authentication logic
 */
class AuthController {
    /**
     * Sign up with Google OAuth
     * Initiates Google OAuth flow via Supabase
     */
    static async signUpWithGoogle(req, res) {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${process.env.CLIENT_URL}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Failed to initiate Google OAuth',
                    error: error.message
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Google OAuth initiated',
                data: {
                    url: data.url
                }
            });
        } catch (error) {
            console.error('Sign up error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Sign in with Google OAuth
     * Same as sign up - Supabase handles both
     */
    static async signInWithGoogle(req, res) {
        return AuthController.signUpWithGoogle(req, res);
    }

    /**
     * Handle OAuth callback
     * Process the OAuth response and create/update user
     */
    static async handleOAuthCallback(req, res) {
        try {
            const { access_token, refresh_token } = req.body;

            if (!access_token) {
                return res.status(400).json({
                    success: false,
                    message: 'Access token is required'
                });
            }

            // Get user from Supabase
            const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser(access_token);

            if (userError || !supabaseUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid access token'
                });
            }

            // Check if user exists in our database
            let user = await UserModel.findByEmail(supabaseUser.email);

            // If user doesn't exist, create new user
            if (!user) {
                user = await UserModel.create({
                    email: supabaseUser.email,
                    full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
                    avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
                    provider: 'google',
                    provider_id: supabaseUser.id,
                    role: 'user' // Default role is 'user', admin must be set manually
                });

                if (!user) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create user'
                    });
                }
            }

            // Generate our own JWT tokens
            const tokens = generateTokenPair(user);

            // Return user data and tokens
            return res.status(200).json({
                success: true,
                message: 'Authentication successful',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        avatar_url: user.avatar_url,
                        role: user.role
                    },
                    tokens
                }
            });
        } catch (error) {
            console.error('OAuth callback error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Refresh access token
     */
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            // Verify refresh token
            const decoded = verifyToken(refreshToken);

            // Get user from database
            const user = await UserModel.findById(decoded.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Generate new token pair
            const tokens = generateTokenPair(user);

            return res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: { tokens }
            });
        } catch (error) {
            console.error('Refresh token error:', error);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token',
                error: error.message
            });
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile(req, res) {
        try {
            const user = await UserModel.findById(req.user.id);

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
                        created_at: user.created_at
                    }
                }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Sign out
     */
    static async signOut(req, res) {
        try {
            // In a production app, you might want to blacklist the token
            // For now, we'll just return success (client should delete tokens)
            return res.status(200).json({
                success: true,
                message: 'Signed out successfully'
            });
        } catch (error) {
            console.error('Sign out error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

export default AuthController;
