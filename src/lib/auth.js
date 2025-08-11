// src/lib/auth.js - Your simple phone/name approach
import { supabase } from './supabase'

export const login = async (name, phoneNumber) => {
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
        role: 'member'
      })
      .select()
      .single()

    if (error) throw error
    user = newUser
  }

  // Store session locally (45 days)
  const session = {
    user,
    expiresAt: Date.now() + (45 * 24 * 60 * 60 * 1000)
  }
  
  localStorage.setItem('rmcbuddy_session', JSON.stringify(session))
  return user
}

export const getCurrentUser = () => {
  const sessionStr = localStorage.getItem('rmcbuddy_session')
  if (!sessionStr) return null
  
  const session = JSON.parse(sessionStr)
  if (Date.now() > session.expiresAt) {
    localStorage.removeItem('rmcbuddy_session')
    return null
  }
  
  return session.user
}
