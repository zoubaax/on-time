/**
 * API Configuration
 * Centralized API endpoint configuration
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        GOOGLE: `${API_URL}/auth/google`,
        CALLBACK: `${API_URL}/auth/callback`,
        REFRESH: `${API_URL}/auth/refresh`,
        PROFILE: `${API_URL}/auth/profile`,
        SIGNOUT: `${API_URL}/auth/signout`,
        SIGNUP: `${API_URL}/auth/signup`,
        SIGNIN: `${API_URL}/auth/signin`,
    },

    // User endpoints
    USERS: {
        BASE: `${API_URL}/users`,
        PROFILE: `${API_URL}/users/profile/me`,
        BY_ID: (id) => `${API_URL}/users/${id}`,
        ROLE: (id) => `${API_URL}/users/${id}/role`,
    },

    // Health check
    HEALTH: `${API_URL}/health`,
};

export default API_ENDPOINTS;
