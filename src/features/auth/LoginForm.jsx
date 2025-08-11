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
    <div className="w-full max-w-sm mx-auto">
      <div className="glass rounded-2xl p-6 border border-white/10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 gradient-roscommon rounded-2xl flex items-center justify-center text-2xl">
            🎵
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Welcome to RMCBuddy
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your name and phone number to continue
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-sm">⚠️</span>
              <span className="text-red-300 text-sm font-medium">
                {error}
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={formErrors.name}
            disabled={isLoading}
            autoComplete="name"
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
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              🔒 Simple & secure authentication
            </p>
            <p className="text-xs text-gray-500">
              You'll stay logged in for 30 days
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="mt-4 glass rounded-xl p-4 border border-white/5">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-yellow-400 mb-2">
            About RMCBuddy
          </h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Suggest songs for the choir to sing</p>
            <p>• Vote on new song suggestions</p>
            <p>• View choir repertoire and lyrics</p>
            <p>• Create setlists for performances</p>
          </div>
        </div>
      </div>
    </div>
  )
}
