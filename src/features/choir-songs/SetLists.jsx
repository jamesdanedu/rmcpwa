'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import Button from '../../ui/Button'
import LoadingSpinner from '../../ui/LoadingSpinner'

export default function SetLists() {
  const { isAuthenticated } = useAuth()
  const [setlists, setSetlists] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSetlists = async () => {
      try {
        setIsLoading(true)
        
        // Mock data for now
        const mockSetlists = [
          {
            id: '1',
            name: 'Spring Concert 2025',
            event_date: '2025-03-15',
            total_duration_minutes: 45,
            song_count: 8
          }
        ]
        
        setSetlists(mockSetlists)
        
      } catch (err) {
        console.error('Error loading setlists:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSetlists()
  }, [])

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      alert('Please log in to create setlists')
      return
    }
    alert('Create setlist functionality coming soon!')
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

      <div className="space-y-3">
        {setlists.map((setlist) => (
          <div
            key={setlist.id}
            className="glass rounded-xl p-4 border border-white/10"
          >
            <h4 className="text-white font-semibold text-sm mb-1">
              {setlist.name}
            </h4>
            <p className="text-gray-400 text-xs">
              {setlist.event_date} • {setlist.total_duration_minutes} min • {setlist.song_count} songs
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
