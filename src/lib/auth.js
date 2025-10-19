import { supabase } from './supabase'
import { APP_CONFIG } from './constants'

// Normalize phone number to consistent format (remove spaces, ensure + prefix)
const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return phoneNumber
  
  // Remove all spaces, dashes, parentheses
  let normalized = phoneNumber.replace(/[\s\-\(\)]/g, '')
  
  // Ensure it starts with +
  if (!normalized.startsWith('+')) {
    normalized = '+' + normalized
  }
  
  return normalized
}

export const login = async (name, phoneNumber) => {
  try {
    // Normalize the phone number for consistent database lookup
    const normalizedPhone = normalizePhoneNumber(phoneNumber)
    
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .single()

    let user = existingUser

    if (!existingUser) {
      // Create new user with normalized phone number
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          name,
          full_name: name,
          phone_number: normalizedPhone,
          role: 'member',
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      user = newUser
    }

    // Store session locally
    const session = {
      user,
      loginTime: Date.now(),
      expiresAt: Date.now() + APP_CONFIG.sessionDuration
    }
    
    localStorage.setItem('rmcbuddy_session', JSON.stringify(session))
    return { user, error: null }
    
  } catch (error) {
    console.error('Login error:', error)
    return { user: null, error: error.message }
  }
}

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  
  const sessionStr = localStorage.getItem('rmcbuddy_session')
  if (!sessionStr) return null
  
  try {
    const session = JSON.parse(sessionStr)
    
    // Check if session expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('rmcbuddy_session')
      return null
    }
    
    return session.user
  } catch {
    localStorage.removeItem('rmcbuddy_session')
    return null
  }
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rmcbuddy_session')
  }
}

export const isAuthenticated = () => {
  return getCurrentUser() !== null
}
