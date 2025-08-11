'use client'

import { useAuth } from '../../../hooks/useAuth'
import LoadingSpinner from '../../ui/LoadingSpinner'
import LoginForm from './LoginForm'

export default function AuthGuard({ children, requireAuth = true }) {
  const { user, isLoading } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading RMCBuddy...
          </p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return (
      <div className="app-container">
        <header className="gradient-roscommon p-5 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">
            RMCBuddy
          </h1>
          <p className="text-sm font-medium opacity-90">
            Roscommon Mens Choir
          </p>
        </header>
        
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6">
          <LoginForm />
        </div>
      </div>
    )
  }

  // If user is logged in or auth is not required
  return children
}
