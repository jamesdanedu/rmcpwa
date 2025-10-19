'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getSetlists } from '../../lib/api'
import { canUserEdit } from '../../lib/permissions'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import SetlistCreatorWizard from './SetlistCreatorWizard'
import SetlistsList from './SetlistsList'

export default function SetLists() {
  const { user, isAuthenticated } = useAuth()
  const [setlists, setSetlists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreator, setShowCreator] = useState(false)
  const [editingSetlist, setEditingSetlist] = useState(null)

  // Check if user can edit/create setlists
  const isEditor = user?.id && canUserEdit(user.id)

  // FIX: Use user?.id instead of user to prevent infinite loop
  useEffect(() => {
    if (user?.id) {
      loadSetlists()
    }
  }, [user?.id])  // ← CRITICAL FIX: Only depend on user.id, not entire user object

  const loadSetlists = async () => {
    try {
      setIsLoading(true)
      const data = await getSetlists(user.id)
      setSetlists(data || [])
    } catch (err) {
      console.error('Error loading setlists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      alert('Please log in to create setlists')
      return
    }
    if (!isEditor) {
      alert('Only editors can create setlists')
      return
    }
    setEditingSetlist(null)
    setShowCreator(true)
  }

  const handleEditSetlist = (setlist) => {
    if (!isAuthenticated) {
      alert('Please log in to edit setlists')
      return
    }
    if (!isEditor) {
      alert('Only editors can edit setlists')
      return
    }
    setEditingSetlist(setlist)
    setShowCreator(true)
  }

  const handleSetlistCreated = () => {
    setShowCreator(false)
    setEditingSetlist(null)
    loadSetlists()
  }

  const handleCancel = () => {
    setShowCreator(false)
    setEditingSetlist(null)
  }

  // Show the SetlistCreatorWizard component for create or edit
  if (showCreator) {
    return (
      <SetlistCreatorWizard
        onSetlistCreated={handleSetlistCreated}
        onCancel={handleCancel}
        editingSetlist={editingSetlist}
      />
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading setlists...
          </p>
        </div>
      </div>
    )
  }

  // Main view
  return (
    <div className="space-y-6">
      {/* Only show Create button for editors */}
      {isEditor && (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleCreateClick}
        >
          ➕ Create New Setlist
        </Button>
      )}

      <SetlistsList 
        setlists={setlists} 
        onEdit={handleEditSetlist}
      />
    </div>
  )
}
