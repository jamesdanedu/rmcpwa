import { create } from 'zustand'
import { getCurrentUser, login as authLogin, logout as authLogout } from '../lib/auth'

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  // Initialize user from localStorage
  init: () => {
    const user = getCurrentUser()
    set({ user })
  },

  // Login
  login: async (name, phoneNumber) => {
    set({ isLoading: true, error: null })
    
    const { user, error } = await authLogin(name, phoneNumber)
    
    if (error) {
      set({ error, isLoading: false })
      return false
    }
    
    set({ user, isLoading: false })
    return true
  },

  // Logout
  logout: () => {
    authLogout()
    set({ user: null, error: null })
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Check if authenticated
  isAuthenticated: () => !!get().user
}))
