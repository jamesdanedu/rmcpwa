import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

export const useAuth = () => {
  const { 
    user, 
    isLoading, 
    error, 
    init, 
    login, 
    logout, 
    clearError, 
    isAuthenticated 
  } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: isAuthenticated(),
    
    // Helper methods
    isAdmin: () => user?.role === 'admin',
    canCreateSetlists: () => !!user, // Any authenticated user can create setlists
    userName: user?.name || 'Guest'
  }
}
