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
     * Sign up with Email/Password
     */
    static async signUp(req, res) {
        try {
            const { email, password, full_name } = req.body;

            // 1. Sign up with Supabase Auth
            const { data: { user: supabaseUser, session }, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name }
                }
            });

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (!supabaseUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Sign up failed'
                });
            }

            // 2. Create user in our database
            // Note: If email confirmation is enabled, session might be null.
            // We should still create the user record so they exist.
            let user = await UserModel.findByEmail(email);

            if (!user) {
                user = await UserModel.create({
                    id: supabaseUser.id,
                    email: supabaseUser.email,
                    full_name: full_name || 'User',
                    avatar_url: null,
                    provider: 'email',
                    provider_id: supabaseUser.id,
                    role: 'user'
                });
            }

            // 3. Response
            if (session) {
                // If we got a session (email confirm disabled or auto-confirmed), return tokens
                const tokens = generateTokenPair(user);
                return res.status(201).json({
                    success: true,
                    message: 'Sign up successful',
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            full_name: user.full_name,
                            role: user.role
                        },
                        tokens
                    }
                });
            } else {
                // Email confirmation required
                return res.status(200).json({
                    success: true,
                    message: 'Sign up successful! Please check your email to confirm your account.',
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            full_name: user.full_name,
                            role: user.role
                        }
                    }
                });
            }
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
     * Sign in with Email/Password
     */
    static async signIn(req, res) {
        try {
            const { email, password } = req.body;

            // 1. Sign in with Supabase Auth
            const { data: { user: supabaseUser, session }, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return res.status(401).json({
                    success: false,
                    message: error.message // Return exact error (e.g., "Email not confirmed")
                });
            }

            // 2. Get user from our database
            let user = await UserModel.findById(supabaseUser.id);

            // If user exists in Auth but not DB (rare edge case), create them
            if (!user) {
                user = await UserModel.create({
                    id: supabaseUser.id,
                    email: supabaseUser.email,
                    full_name: supabaseUser.user_metadata?.full_name || 'User',
                    avatar_url: null,
                    provider: 'email',
                    provider_id: supabaseUser.id,
                    role: 'user'
                });
            }

            // 3. Generate tokens
            const tokens = generateTokenPair(user);

            return res.status(200).json({
                success: true,
                message: 'Sign in successful',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        role: user.role,
                        avatar_url: user.avatar_url
                    },
                    tokens
                }
            });
        } catch (error) {
            console.error('Sign in error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
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
                    id: supabaseUser.id, // Explicitly set ID to match Supabase Auth UUID
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
