'use client'

import { useState, useEffect } from 'react'
import { getChoirSongs } from '../../lib/api'
import GenreFilter from './GenreFilter'
import AvailableSongs from './AvailableSongs'
import CurrentSetlist from './CurrentSetlist'
import DurationTracker from './DurationTracker'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function SetlistSongsStep({ 
  formData, 
  selectedSongs = [],
  onSongsChange,
  onBack, 
  onSave,
  isSaving,
  isEditMode = false
}) {
  const [availableSongs, setAvailableSongs] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Initialize setlist from pre-selected songs (for edit mode)
  const [currentSetlist, setCurrentSetlist] = useState(() => {
    return selectedSongs.map((song, index) => ({
      id: song.id || `setlist-${index}`,
      song: song,
      position: index + 1
    }))
  })

  useEffect(() => {
    loadSongs()
  }, [])

  useEffect(() => {
    // Update parent component when songs change
    const songs = currentSetlist.map(item => item.song || item)
    onSongsChange(songs)
  }, [currentSetlist, onSongsChange])

  useEffect(() => {
    // Filter songs by genre
    let filtered = availableSongs

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(song => song.genre === selectedGenre)
    }

    // Remove songs already in setlist
    const setlistSongIds = currentSetlist.map(item => item.song?.id || item.id)
    filtered = filtered.filter(song => !setlistSongIds.includes(song.id))

    setFilteredSongs(filtered)
  }, [availableSongs, selectedGenre, currentSetlist])

  const loadSongs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const songs = await getChoirSongs()
      setAvailableSongs(songs)
      
    } catch (err) {
      console.error('Error loading choir songs:', err)
      setError('Failed to load choir songs')
    } finally {
      setIsLoading(false)
    }
  }

  const addToSetlist = (song) => {
    const newItem = {
      id: `setlist-${Date.now()}`,
      song,
      position: currentSetlist.length + 1
    }
    
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
      return total + (item.song?.duration_minutes || item.duration_minutes || 0)
    }, 0)
  }

  const handleSave = () => {
    const songs = currentSetlist.map(item => item.song || item)
    onSave(songs)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading songs...
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
          <p className="text-red-200 text-sm mb-4">{error}</p>
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>
    )
  }

  const totalDuration = calculateTotalDuration()
  const targetDuration = parseInt(formData.targetDuration) || 0

  return (
    <div className="space-y-6">
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
          onClick={onBack}
          disabled={isSaving}
        >
          ← Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-2"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving || currentSetlist.length === 0}
        >
          {isSaving 
            ? (isEditMode ? 'Updating...' : 'Creating...') 
            : (isEditMode ? 'Update Setlist' : 'Create Setlist')
          }
        </Button>
      </div>
    </div>
  )
}
