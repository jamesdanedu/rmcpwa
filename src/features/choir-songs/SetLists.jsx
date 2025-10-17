'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getSetlists, getSetlistById } from '../../lib/api'
import { exportSetlistToPDF } from '../../lib/pdf-export'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import SetlistCreator from './SetlistCreator'
import SetlistsList from './SetlistsList'

export default function SetLists() {
  const { user, isAuthenticated } = useAuth()
  const [setlists, setSetlists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreator, setShowCreator] = useState(false)
  const [editingSetlist, setEditingSetlist] = useState(null)

  useEffect(() => {
    if (user) {
      loadSetlists()
    }
  }, [user])

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
    setEditingSetlist(null)
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

  // Show the SetlistCreator component
  if (showCreator) {
    return (
      <SetlistCreator
        onSetlistCreated={handleSetlistCreated}
        onCancel={handleCancel}
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
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleCreateClick}
      >
        ➕ Create New Setlist
      </Button>

      <SetlistsList setlists={setlists} />
    </div>
  )
}
