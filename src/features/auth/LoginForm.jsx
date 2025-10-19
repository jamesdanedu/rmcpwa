// src/features/auth/LoginForm.jsx
'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'

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
      setFormData({ name: '', phoneNumber: '' })
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px'
      }}>
        {/* Logo and Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          {/* Project Icon - PNG from public/icons */}
          <img 
            src="/icons/icon-192x192.png" 
            alt="RMCBuddy Logo"
            style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 24px',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          />
          
          <h1 style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            RMCBuddy
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500'
          }}>
            Roscommon Mens Choir
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '40px 32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Welcome Text */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '8px'
            }}>
              Welcome Back
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6B7280'
            }}>
              Enter your details to access the choir management system
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span style={{
                color: '#991B1B',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {error}
              </span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Full Name Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isLoading}
                autoComplete="name"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: formErrors.name ? '2px solid #EF4444' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: isLoading ? '#F9FAFB' : '#FFFFFF',
                  color: '#1F2937',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  if (!formErrors.name) {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = formErrors.name ? '#EF4444' : '#E5E7EB'
                  e.target.style.boxShadow = 'none'
                }}
              />
              {formErrors.name && (
                <p style={{
                  color: '#EF4444',
                  fontSize: '13px',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>⚠️</span>
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Phone Number Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={isLoading}
                autoComplete="tel"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: formErrors.phoneNumber ? '2px solid #EF4444' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: isLoading ? '#F9FAFB' : '#FFFFFF',
                  color: '#1F2937',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  if (!formErrors.phoneNumber) {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = formErrors.phoneNumber ? '#EF4444' : '#E5E7EB'
                  e.target.style.boxShadow = 'none'
                }}
              />
              {formErrors.phoneNumber && (
                <p style={{
                  color: '#EF4444',
                  fontSize: '13px',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>⚠️</span>
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                background: isLoading 
                  ? '#9CA3AF' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid #FFFFFF',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing In...
                </>
              ) : (
                <>
                  🔐 Sign In
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                <span style={{ fontSize: '18px' }}>🔒</span>
                <span>Simple & secure authentication</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                <span style={{ fontSize: '18px' }}>⏰</span>
                <span>You'll stay logged in for 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
