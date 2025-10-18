// src/hooks/useCanEdit.js
import { useAuth } from './useAuth'
import { canUserEdit } from '../lib/permissions'

/**
 * Custom hook to check if the current user has edit permissions
 * for songs and lyrics.
 * 
 * Returns:
 * - canEdit: boolean - true if user is in EDITOR_USERS list
 * - userId: string - the current user's ID
 * - user: object - the full user object
 * 
 * Usage:
 * const { canEdit, userId } = useCanEdit()
 * 
 * if (canEdit) {
 *   // Show edit/delete buttons
 * }
 */
export const useCanEdit = () => {
  const { user } = useAuth()
  
  return {
    canEdit: user ? canUserEdit(user.id) : false,
    userId: user?.id,
    user: user
  }
}
