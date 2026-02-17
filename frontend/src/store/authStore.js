/**
 * Auth Store using Zustand
 * Global state management for authentication
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            isAuthenticated: false,
            isLoading: true,
            error: null,

            // Actions
            setUser: (user) => set({ user, isAuthenticated: !!user, error: null }),

            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error }),

            signIn: async () => {
                try {
                    set({ isLoading: true, error: null });
                    await authService.signInWithGoogle();
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    throw error;
                }
            },

            handleCallback: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const { user } = await authService.handleOAuthCallback();
                    set({ user, isAuthenticated: true, isLoading: false });
                    return user;
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                    throw error;
                }
            },

            loadUser: async () => {
                try {
                    set({ isLoading: true });
                    const user = await authService.getProfile();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },

            updateProfile: async (updates) => {
                try {
                    const user = await authService.updateProfile(updates);
                    set({ user });
                    return user;
                } catch (error) {
                    set({ error: error.message });
                    throw error;
                }
            },

            signOut: async () => {
                try {
                    await authService.signOut();
                    set({ user: null, isAuthenticated: false, error: null });
                } catch (error) {
                    console.error('Sign out error:', error);
                    // Clear state anyway
                    set({ user: null, isAuthenticated: false, error: null });
                }
            },

            clearError: () => set({ error: null }),

            // Computed values
            isAdmin: () => {
                const { user } = get();
                return user?.role === 'admin';
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
