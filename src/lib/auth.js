import { supabase } from './supabase'
import { APP_CONFIG } from './constants'

export const login = async (name, phoneNumber) => {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single()

    let user = existingUser

    if (!existingUser) {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          name,
          full_name: name,
          phone_number: phoneNumber,
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
