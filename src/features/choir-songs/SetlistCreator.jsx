'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getChoirSongs, createSetlist } from '../../lib/api'
import { GENRES } from '../../lib/constants'
import SetlistForm from './SetlistForm'
import GenreFilter from './GenreFilter'
import AvailableSongs from './AvailableSongs'
import CurrentSetlist from './CurrentSetlist'
import DurationTracker from './DurationTracker'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function SetlistCreator({ onSetlistCreated, onCancel }) {
  const { user } = useAuth()
  const [availableSongs, setAvailableSongs] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [currentSetlist, setCurrentSetlist] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    eventDate: '',
    targetDuration: '',
    venueNotes: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const songs = await getChoirSongs()
        
        // Debug logging to see what we're getting
        console.log('Loaded songs from API:', songs)
        console.log('First song structure:', songs[0])
        
        setAvailableSongs(songs)
        
      } catch (err) {
        console.error('Error loading choir songs:', err)
        setError('Failed to load choir songs')
      } finally {
        setIsLoading(false)
      }
    }

    loadSongs()
  }, [])

  useEffect(() => {
    // Filter songs by genre
    let filtered = availableSongs

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(song => song.genre === selectedGenre)
    }

    // Remove songs already in setlist
    const setlistSongIds = currentSetlist.map(item => item.song.id)
    filtered = filtered.filter(song => !setlistSongIds.includes(song.id))

    setFilteredSongs(filtered)
  }, [availableSongs, selectedGenre, currentSetlist])

  const addToSetlist = (song) => {
    const newItem = {
      id: `setlist-${Date.now()}`,
      song,
      position: currentSetlist.length + 1
    }
    
    console.log('Adding song to setlist:', song)
    setCurrentSetlist(prev => [...prev, newItem])
  }

  const removeFromSetlist = (itemId) => {
    setCurrentSetlist(prev => {
      const filtered = prev.filter(item => item.id !== itemId)
      // Reorder positions
      return filtered.map((item, index) => ({
        ...item,
        position: index + 1
      }))
    })
  }

  const reorderSetlist = (dragIndex, hoverIndex) => {
    setCurrentSetlist(prev => {
      const newList = [...prev]
      const draggedItem = newList[dragIndex]
      
      // Remove dragged item
      newList.splice(dragIndex, 1)
      // Insert at new position
      newList.splice(hoverIndex, 0, draggedItem)
      
      // Update positions
      return newList.map((item, index) => ({
        ...item,
        position: index + 1
      }))
    })
  }

  const calculateTotalDuration = () => {
    return currentSetlist.reduce((total, item) => {
      return total + (item.song.duration_minutes || 0)
    }, 0)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Setlist name is required')
      return
    }

    if (!formData.eventDate) {
      setError('Event date is required')
      return
    }

    if (currentSetlist.length === 0) {
      setError('Please add at least one song to the setlist')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const setlistData = {
        name: formData.name.trim(),
        event_date: formData.eventDate,
        target_duration_minutes: formData.targetDuration ? parseInt(formData.targetDuration) : null,
        venue_notes: formData.venueNotes.trim() || null,
        total_duration_minutes: calculateTotalDuration(),
        song_count: currentSetlist.length
      }

      const newSetlist = await createSetlist(setlistData, user.id)
      
      // TODO: Save setlist songs to junction table
      // This would require an additional API call to save the songs with positions
      
      onSetlistCreated(newSetlist)
      
    } catch (err) {
      console.error('Error creating setlist:', err)
      setError(err.message || 'Failed to create setlist')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading songs for setlist creation...
          </p>
        </div>
      </div>
    )
  }

  if (error && availableSongs.length === 0) {
    return (
      <div className="glass rounded-xl p-6 border border-red-500/20 bg-red-500/10">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-3">⚠️</div>
          <h3 className="text-red-300 font-semibold mb-2">Error</h3>
          <p className="text-red-200 text-sm mb-4">{error}</p>
          <Button variant="secondary" onClick={onCancel}>
            Back to Setlists
          </Button>
        </div>
      </div>
    )
  }

  const totalDuration = calculateTotalDuration()
  const targetDuration = parseInt(formData.targetDuration) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          🎼 Create New Setlist
        </h2>
        <p className="text-gray-400 text-sm">
          Build your setlist by adding songs and organizing the performance order
        </p>
      </div>

      {/* Debug Info - Remove this after fixing */}
      {availableSongs.length > 0 && (
        <div className="glass rounded-xl p-4 border border-blue-500/20 bg-blue-500/10">
          <div className="text-xs text-blue-300 font-mono">
            <div>Debug: Loaded {availableSongs.length} songs</div>
            <div>First song: {JSON.stringify(availableSongs[0], null, 2)}</div>
          </div>
        </div>
      )}

      {/* Form */}
      <SetlistForm
        formData={formData}
        onChange={setFormData}
        error={error}
        onClearError={() => setError(null)}
      />

      {/* Duration Tracker */}
      <DurationTracker
        currentDuration={totalDuration}
        targetDuration={targetDuration}
        songCount={currentSetlist.length}
      />

      {/* Genre Filter */}
      <GenreFilter
        availableSongs={availableSongs}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        filteredCount={filteredSongs.length}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Songs */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">
            Available Songs ({filteredSongs.length})
          </h3>
          <AvailableSongs
            songs={filteredSongs}
            onAddToSetlist={addToSetlist}
            selectedGenre={selectedGenre}
          />
        </div>

        {/* Current Setlist */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Current Setlist
            <span className="text-sm font-normal text-gray-400">
              ({currentSetlist.length} songs)
            </span>
          </h3>
          <CurrentSetlist
            setlist={currentSetlist}
            onRemove={removeFromSetlist}
            onReorder={reorderSetlist}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6 border-t border-white/10">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-2"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving || currentSetlist.length === 0}
        >
          {isSaving ? 'Creating Setlist...' : 'Create Setlist'}
        </Button>
      </div>
    </div>
  )
}
