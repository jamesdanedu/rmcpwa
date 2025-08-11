'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]{8,}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid phone number'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field-specific error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Clear general error
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const success = await login(formData.name.trim(), formData.phoneNumber.trim())
    
    if (!success) {
      // Error is handled by the auth store
      setFormData({ name: '', phoneNumber: '' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-surface">
      <div className="w-full max-w-md mx-auto">
        {/* Centered Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 gradient-roscommon bg-clip-text text-transparent">
            RMCBuddy
          </h1>
          
          {/* App Logo - 512x512 scaled down */}
          <div className="w-32 h-32 mx-auto mb-6 filter drop-shadow-2xl">
            <svg 
              width="128" 
              height="128" 
              viewBox="0 0 192 192" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <rect width="192" height="192" rx="32" fill="url(#gradient0_linear_1_1)"/>
              <path d="M96 48C81.6 48 70 59.6 70 74V118C70 132.4 81.6 144 96 144C110.4 144 122 132.4 122 118V74C122 59.6 110.4 48 96 48Z" fill="white"/>
              <path d="M135 92C135 113.5 117.5 131 96 131C74.5 131 57 113.5 57 92H66C66 108.5 79.5 122 96 122C112.5 122 126 108.5 126 92H135Z" fill="white"/>
              <defs>
                <linearGradient id="gradient0_linear_1_1" x1="0" y1="0" x2="192" y2="192" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6"/>
                  <stop offset="1" stopColor="#EC4899"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <p className="text-lg text-gray-300 font-medium">
            Roscommon Mens Choir
          </p>
        </div>

        {/* Rounded Rectangle Login Container */}
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enter your details to access the choir management system
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-lg">⚠️</span>
                <span className="text-red-300 font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={formErrors.name}
              disabled={isLoading}
              autoComplete="name"
              className="text-lg py-4"
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              error={formErrors.phoneNumber}
              disabled={isLoading}
              autoComplete="tel"
              className="text-lg py-4"
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                className="w-full py-4 text-lg font-bold"
              >
                {isLoading ? 'Signing In...' : '🔐 Sign In'}
              </Button>
            </div>
          </form>

          {/* Security & Info Section */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="space-y-4">
              {/* Security Info */}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-green-400 text-lg">🔒</span>
                <span className="text-gray-300">Simple & secure authentication</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <span className="text-blue-400 text-lg">⏰</span>
                <span className="text-gray-300">You'll stay logged in for 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Features Card */}
        <div className="mt-6 glass rounded-2xl p-6 border border-white/5">
          <div className="text-center">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">
              🎵 About RMCBuddy
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <span className="text-lg">💡</span>
                <span>Suggest songs for the choir to sing</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🗳️</span>
                <span>Vote on new song suggestions</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🎼</span>
                <span>View choir repertoire and lyrics</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📋</span>
                <span>Create setlists for performances</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
