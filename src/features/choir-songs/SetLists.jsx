'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getSetlists } from '../../lib/api'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import SetlistCreatorWizard from './SetlistCreatorWizard'
import SetlistsListView from './SetlistsListView'

export default function SetLists() {
  const { user, isAuthenticated } = useAuth()
  const [setlists, setSetlists] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState('list') // 'list' | 'detail' | 'create'
  const [selectedSetlistId, setSelectedSetlistId] = useState(null)

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
    setCurrentView('create')
  }

  const handleSetlistCreated = () => {
    setCurrentView('list')
    loadSetlists()
  }

  const handleCancel = () => {
    setCurrentView('list')
    setSelectedSetlistId(null)
  }

  const handleSetlistClick = (setlist) => {
    console.log('Setlist clicked:', setlist)
    setSelectedSetlistId(setlist.id)
    // Phase 2: setCurrentView('detail')
    alert(`Detail view coming in Phase 2!\n\nSetlist: ${setlist.name}\nDate: ${setlist.event_date}\nSongs: ${setlist.song_count}`)
  }

  // Show the SetlistCreator component
  if (currentView === 'create') {
    return (
      <SetlistCreatorWizard
        onSetlistCreated={handleSetlistCreated}
        onCancel={handleCancel}
      />
    )
  }

  // Phase 2: Detail view will go here
  // if (currentView === 'detail') {
  //   return (
  //     <SetlistDetailView
  //       setlistId={selectedSetlistId}
  //       onBack={handleCancel}
  //       onEdit={() => setCurrentView('edit')}
  //     />
  //   )
  // }

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

  // List view (Phase 1)
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

      <SetlistsListView 
        setlists={setlists} 
        onSetlistClick={handleSetlistClick}
      />
    </div>
  )
}
