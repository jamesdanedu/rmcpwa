// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Custom auth for phone/name login
export const simpleLogin = async (name, phoneNumber) => {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name, phone_number')
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

    // Store user info in localStorage for PWA
    localStorage.setItem('rmcbuddy_user', JSON.stringify(user))
    localStorage.setItem('rmcbuddy_login_time', Date.now().toString())
    
    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('rmcbuddy_user')
  const loginTime = localStorage.getItem('rmcbuddy_login_time')
  
  if (!userStr || !loginTime) return null
  
  // Check if login is still valid (30 days)
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
  if (Date.now() - parseInt(loginTime) > thirtyDaysMs) {
    localStorage.removeItem('rmcbuddy_user')
    localStorage.removeItem('rmcbuddy_login_time')
    return null
  }
  
  return JSON.parse(userStr)
}
