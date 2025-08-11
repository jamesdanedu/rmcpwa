'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { getSetlists } from '../../../lib/api'
import SetlistsList from './SetlistsList'
import SetlistCreator from './SetlistCreator'
import Button from '../../ui/Button'
import LoadingSpinner from '../../ui/LoadingSpinner'

export default function SetLists() {
  const { isAuthenticated } = useAuth()
  const [setlists, setSetlists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreator, setShowCreator] = useState(false)

  useEffect(() => {
    const loadSetlists = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await getSetlists()
        setSetlists(data)
        
      } catch (err) {
        console.error('Error loading setlists:', err)
        setError('Failed to load setlists')
      } finally {
        setIsLoading(false)
      }
    }

    loadSetlists()
  }, [])

  const handleSetlistCreated = (newSetlist) => {
    setSetlists(prev => [newSetlist, ...prev])
    setShowCreator(false)
  }

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      alert('Please log in to create setlists')
      return
    }
    setShowCreator(true)
  }

  if (showCreator) {
    return (
      <SetlistCreator
        onSetlistCreated={handleSetlistCreated}
        onCancel={() => setShowCreator(false)}
      />
    )
  }

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

  if (error) {
    return (
      <div className="glass rounded-xl p-6 border border-red-500/20 bg-red-500/10">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-3">⚠️</div>
          <h3 className="text-red-300 font-semibold mb-2">Error</h3>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleCreateClick}
        >
          ➕ Create New Setlist
        </Button>
      </div>

      {/* Setlists */}
      <SetlistsList setlists={setlists} />
    </div>
  )
}
