'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Image from 'next/image'

// Common countries with their calling codes and flag emojis
const COUNTRIES = [
  { code: 'IE', name: 'Ireland', dial: '+353', flag: '🇮🇪' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'UA', name: 'Ukraine', dial: '+380', flag: '🇺🇦' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dial: '+32', flag: '🇧🇪' },
  { code: 'PL', name: 'Poland', dial: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dial: '+351', flag: '🇵🇹' },
]

export default function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    countryCode: 'IE' // Default to Ireland
  })
  const [formErrors, setFormErrors] = useState({})

  const selectedCountry = COUNTRIES.find(c => c.code === formData.countryCode) || COUNTRIES[0]

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!/^[\d\s\-]{7,}$/.test(formData.phoneNumber.trim())) {
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
    
    // Remove all spaces and dashes from the phone number
    const cleanNumber = formData.phoneNumber.trim().replace(/[\s\-]/g, '')
    
    // Combine country code with cleaned phone number
    const fullPhoneNumber = `${selectedCountry.dial}${cleanNumber}`
    
    console.log('Submitting login with:', { name: formData.name.trim(), fullPhoneNumber })
    
    const success = await login(formData.name.trim(), fullPhoneNumber)
    
    if (!success) {
      // Error is handled by the auth store
      setFormData(prev => ({ ...prev, name: '', phoneNumber: '' }))
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background to-surface">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
        {/* Centered Title */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2 sm:mb-3 gradient-roscommon bg-clip-text text-transparent">
            RMCBuddy
          </h1>
          
          <p className="text-sm sm:text-base text-gray-300 font-medium mb-4 sm:mb-5">
            Roscommon Mens Choir
          </p>
          
          {/* App Icon - Reduced Size */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-5 filter drop-shadow-2xl">
            <Image
              src="/icons/icon-512x512.png"
              alt="RMCBuddy Logo"
              width={512}
              height={512}
              className="w-full h-full rounded-3xl"
              priority
            />
          </div>
        </div>

        {/* Rounded Rectangle Login Container - More Compact */}
        <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 sm:p-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-lg sm:text-xl">⚠️</span>
                <span className="text-red-300 font-medium text-sm sm:text-base">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={formErrors.name}
              disabled={isLoading}
              autoComplete="name"
              className="text-base sm:text-lg py-5 sm:py-6 px-4 sm:px-5"
            />

            {/* Combined Phone Number Input */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-200">
                Phone Number
                <span className="text-yellow-400 ml-1">*</span>
              </label>
              
              <div className={`
                flex items-center
                rounded-xl 
                bg-black/40 backdrop-blur-sm
                border-2 transition-all duration-200
                ${formErrors.phoneNumber
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-400/20' 
                  : 'border-white/20 focus-within:border-yellow-400 focus-within:ring-4 focus-within:ring-yellow-400/20'
                }
                hover:border-white/30
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}>
                {/* Country Selector - Integrated */}
                <div className="relative flex-shrink-0">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    disabled={isLoading}
                    className="
                      bg-transparent
                      text-white
                      focus:outline-none
                      disabled:cursor-not-allowed
                      pl-4 pr-2 py-5 sm:py-6
                      text-base sm:text-lg
                      appearance-none
                      cursor-pointer
                      border-r border-white/20
                    "
                    style={{ minWidth: '90px' }}
                  >
                    {COUNTRIES.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.dial}
                      </option>
                    ))}
                  </select>
                  {/* Dropdown arrow */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                    ▼
                  </div>
                </div>

                {/* Phone Number Input - Integrated */}
                <input
                  type="tel"
                  placeholder="87 123 4567"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={isLoading}
                  autoComplete="tel"
                  className="
                    flex-1
                    bg-transparent
                    text-white placeholder-gray-500
                    focus:outline-none
                    disabled:cursor-not-allowed
                    px-4 py-5 sm:py-6
                    text-base sm:text-lg
                  "
                />
              </div>
              
              {formErrors.phoneNumber && (
                <p className="text-red-400 text-xs sm:text-sm font-medium flex items-center gap-1">
                  <span>⚠️</span>
                  {formErrors.phoneNumber}
                </p>
              )}
              
              {/* Helper text - shown only when field is empty */}
              {!formData.phoneNumber && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span>💡</span>
                  <span>Enter your local number (e.g., 87 123 4567)</span>
                </p>
              )}
            </div>

            <div className="pt-2 sm:pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing In...' : '🔐 Sign In'}
              </Button>
            </div>
          </form>

          {/* Security & Info Section */}
          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="text-blue-400 text-lg sm:text-xl">⏰</span>
              <span className="text-gray-300">You'll stay logged in for 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
