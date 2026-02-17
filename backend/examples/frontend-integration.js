// ============================================
// Frontend Integration Example - React/Next.js
// ============================================

// 1. Create an auth context/service
// File: src/services/authService.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class AuthService {
    /**
     * Initiate Google OAuth sign in
     */
    async signInWithGoogle() {
        try {
            const response = await fetch(`${API_URL}/auth/google`);
            const data = await response.json();

            if (data.success) {
                // Redirect to Google OAuth
                window.location.href = data.data.url;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    /**
     * Handle OAuth callback
     * Call this in your callback page after Google redirects back
     */
    async handleOAuthCallback(supabaseAccessToken, supabaseRefreshToken) {
        try {
            const response = await fetch(`${API_URL}/auth/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: supabaseAccessToken,
                    refresh_token: supabaseRefreshToken,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Store tokens securely
                this.setTokens(data.data.tokens);
                this.setUser(data.data.user);
                return data.data;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('OAuth callback error:', error);
            throw error;
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken() {
        try {
            const refreshToken = this.getRefreshToken();

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();

            if (data.success) {
                this.setTokens(data.data.tokens);
                return data.data.tokens.accessToken;
            } else {
                // Refresh token is invalid, sign out
                this.signOut();
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            throw error;
        }
    }

    /**
     * Get current user profile
     */
    async getProfile() {
        try {
            const response = await this.authenticatedFetch(`${API_URL}/auth/profile`);
            const data = await response.json();

            if (data.success) {
                this.setUser(data.data.user);
                return data.data.user;
            } else {
                throw new Error(data.message);
            }
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
            const response = await this.authenticatedFetch(`${API_URL}/users/profile/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            const data = await response.json();

            if (data.success) {
                this.setUser(data.data.user);
                return data.data.user;
            } else {
                throw new Error(data.message);
            }
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
            await this.authenticatedFetch(`${API_URL}/auth/signout`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            // Clear local storage regardless of API response
            this.clearAuth();
            window.location.href = '/login';
        }
    }

    /**
     * Make authenticated fetch request with automatic token refresh
     */
    async authenticatedFetch(url, options = {}) {
        let accessToken = this.getAccessToken();

        if (!accessToken) {
            throw new Error('No access token available');
        }

        // Add authorization header
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        };

        let response = await fetch(url, { ...options, headers });

        // If token expired, try to refresh
        if (response.status === 401) {
            try {
                accessToken = await this.refreshToken();
                headers.Authorization = `Bearer ${accessToken}`;
                response = await fetch(url, { ...options, headers });
            } catch (error) {
                this.signOut();
                throw error;
            }
        }

        return response;
    }

    // ============================================
    // Admin-only methods
    // ============================================

    /**
     * Get all users (Admin only)
     */
    async getAllUsers(roleFilter = null) {
        try {
            const url = roleFilter
                ? `${API_URL}/users?role=${roleFilter}`
                : `${API_URL}/users`;

            const response = await this.authenticatedFetch(url);
            const data = await response.json();

            if (data.success) {
                return data.data.users;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Get all users error:', error);
            throw error;
        }
    }

    /**
     * Update user role (Admin only)
     */
    async updateUserRole(userId, role) {
        try {
            const response = await this.authenticatedFetch(`${API_URL}/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role }),
            });

            const data = await response.json();

            if (data.success) {
                return data.data.user;
            } else {
                throw new Error(data.message);
            }
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
            const response = await this.authenticatedFetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                return true;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    }

    // ============================================
    // Token management
    // ============================================

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

// ============================================
// 2. React Context Provider
// File: src/contexts/AuthContext.jsx
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const initAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const profile = await authService.getProfile();
                    setUser(profile);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                authService.clearAuth();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const signIn = async () => {
        await authService.signInWithGoogle();
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
    };

    const updateProfile = async (updates) => {
        const updatedUser = await authService.updateProfile(updates);
        setUser(updatedUser);
    };

    const value = {
        user,
        loading,
        signIn,
        signOut,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// ============================================
// 3. Protected Route Component
// File: src/components/ProtectedRoute.jsx
// ============================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

// ============================================
// 4. Login Page Component
// File: src/pages/Login.jsx
// ============================================

import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const { signIn, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="login-page">
            <h1>Welcome</h1>
            <button onClick={signIn}>
                Sign in with Google
            </button>
        </div>
    );
};

// ============================================
// 5. OAuth Callback Page
// File: src/pages/AuthCallback.jsx
// ============================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import authService from '../services/authService';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const AuthCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get session from Supabase
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (session) {
                    // Send tokens to your backend
                    await authService.handleOAuthCallback(
                        session.access_token,
                        session.refresh_token
                    );

                    // Redirect to dashboard
                    navigate('/dashboard');
                } else {
                    throw new Error('No session found');
                }
            } catch (error) {
                console.error('Callback error:', error);
                setError(error.message);
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [navigate]);

    if (error) {
        return <div>Error: {error}. Redirecting to login...</div>;
    }

    return <div>Completing sign in...</div>;
};

// ============================================
// 6. Dashboard Component
// File: src/pages/Dashboard.jsx
// ============================================

import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
    const { user, signOut } = useAuth();

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div>
                <p>Welcome, {user?.full_name}!</p>
                <p>Email: {user?.email}</p>
                <p>Role: {user?.role}</p>
                {user?.avatar_url && (
                    <img src={user.avatar_url} alt="Avatar" />
                )}
            </div>
            <button onClick={signOut}>Sign Out</button>
        </div>
    );
};

// ============================================
// 7. Admin Users Management Component
// File: src/pages/AdminUsers.jsx
// ============================================

import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await authService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await authService.updateUserRole(userId, newRole);
            loadUsers(); // Reload users
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await authService.deleteUser(userId);
                loadUsers(); // Reload users
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-users">
            <h1>User Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ============================================
// 8. App Router Setup (React Router v6)
// File: src/App.jsx
// ============================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { AuthCallback } from './pages/AuthCallback';
import { Dashboard } from './pages/Dashboard';
import { AdminUsers } from './pages/AdminUsers';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Login />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

// ============================================
// 9. Environment Variables for Frontend
// File: .env.local
// ============================================

/*
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
*/

// ============================================
// 10. Required Frontend Dependencies
// ============================================

/*
npm install @supabase/supabase-js react-router-dom

For Next.js:
npm install @supabase/supabase-js next
*/
