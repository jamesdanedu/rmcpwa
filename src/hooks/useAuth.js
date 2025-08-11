import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

export const useAuth = () => {
  const { user, isLoading, error, init, login, logout, clearError, isAuthenticated } = useAuthStore()

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
    isAuthenticated: isAuthenticated()
  }
}
