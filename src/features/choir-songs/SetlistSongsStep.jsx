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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size="lg" />
          <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '14px' }}>
            Loading songs...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '2px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
          <h3 style={{ color: '#dc2626', fontWeight: '600', marginBottom: '8px', fontSize: '18px' }}>
            Error
          </h3>
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        minHeight: '500px'
      }}>
        {/* Available Songs - LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎵</span>
            Available Songs
            <span style={{
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#6b7280',
              background: 'rgba(0, 0, 0, 0.05)',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              {filteredSongs.length}
            </span>
          </h3>
          <AvailableSongs
            songs={filteredSongs}
            onAddToSetlist={addToSetlist}
            selectedGenre={selectedGenre}
          />
        </div>

        {/* Current Setlist - RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎼</span>
            Your Setlist
            <span style={{
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#6b7280',
              background: 'rgba(0, 0, 0, 0.05)',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              {currentSetlist.length} {currentSetlist.length === 1 ? 'song' : 'songs'}
            </span>
            {totalDuration > 0 && (
              <span style={{
                fontSize: '14px',
                fontWeight: 'normal',
                color: '#4169E1',
                background: 'rgba(65, 105, 225, 0.1)',
                padding: '4px 12px',
                borderRadius: '12px'
              }}>
                ⏱️ {totalDuration} min
              </span>
            )}
          </h3>
          <CurrentSetlist
            setlist={currentSetlist}
            onRemove={removeFromSetlist}
            onReorder={reorderSetlist}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        paddingTop: '24px',
        borderTop: '2px solid rgba(0, 0, 0, 0.1)'
      }}>
        <Button
          variant="secondary"
          size="lg"
          style={{ flex: 1 }}
          onClick={onBack}
          disabled={isSaving}
        >
          ← Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          style={{ flex: 2 }}
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
