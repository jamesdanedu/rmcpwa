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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background to-surface">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
        {/* Centered Title */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 gradient-roscommon bg-clip-text text-transparent">
            RMCBuddy
          </h1>
          
          {/* App Logo - 512x512 scaled down */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto mb-4 sm:mb-6 filter drop-shadow-2xl">
            <svg 
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
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-medium">
            Roscommon Mens Choir
          </p>
        </div>

        {/* Rounded Rectangle Login Container */}
        <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Welcome Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Enter your details to access the choir management system
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-lg sm:text-xl">⚠️</span>
                <span className="text-red-300 font-medium text-sm sm:text-base">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={formErrors.name}
              disabled={isLoading}
              autoComplete="name"
              className="text-base sm:text-lg py-4 sm:py-5 px-4 sm:px-5"
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
              className="text-base sm:text-lg py-4 sm:py-5 px-4 sm:px-5"
            />

            <div className="pt-2 sm:pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                className="w-full py-4 sm:py-5 text-base sm:text-lg font-bold"
              >
                {isLoading ? 'Signing In...' : '🔐 Sign In'}
              </Button>
            </div>
          </form>

          {/* Security & Info Section */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <div className="space-y-3 sm:space-y-4">
              {/* Security Info */}
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="text-green-400 text-lg sm:text-xl">🔒</span>
                <span className="text-gray-300">Simple & secure authentication</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="text-blue-400 text-lg sm:text-xl">⏰</span>
                <span className="text-gray-300">You'll stay logged in for 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
