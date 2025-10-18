'use client'

import { useState, useEffect } from 'react'
import { getChoirSongs } from '../../lib/api'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function SetlistSongsStep({ 
  formData, 
  selectedSongs,
  onSongsChange,
  onBack, 
  onSave,
  isSaving
}) {
  const [availableSongs, setAvailableSongs] = useState([])
  const [currentSetlist, setCurrentSetlist] = useState(selectedSongs || [])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSongs()
  }, [])

  useEffect(() => {
    const songs = currentSetlist.map(item => item.song || item)
    onSongsChange(songs)
  }, [currentSetlist])

  const loadSongs = async () => {
    try {
      setIsLoading(true)
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
      return filtered.map((item, index) => ({
        ...item,
        position: index + 1
      }))
    })
  }

  const calculateTotalDuration = () => {
    return currentSetlist.reduce((total, item) => {
      return total + (parseFloat(item.song?.duration_minutes) || parseFloat(item.duration_minutes) || 0)
    }, 0)
  }

  const formatDuration = (minutes) => {
    return parseFloat(minutes).toFixed(1)
  }

  const handleSave = () => {
    const songs = currentSetlist.map(item => item.song || item)
    onSave(songs)
  }

  const getFilteredSongs = () => {
    const setlistSongIds = currentSetlist.map(item => item.song?.id || item.id)
    return availableSongs.filter(song => !setlistSongIds.includes(song.id))
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const totalDuration = calculateTotalDuration()
  const targetDuration = parseFloat(formData.targetDuration) || 0
  const percentage = targetDuration > 0 ? (totalDuration / targetDuration) * 100 : 0
  const filteredSongs = getFilteredSongs()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
          {formData.name}
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
          Add songs and organize the performance order
        </p>
      </div>

      {/* Duration Tracker */}
      <div style={{
        background: 'rgba(255, 215, 0, 0.1)',
        border: '2px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '20px' }}>
            {formatDuration(totalDuration)} {targetDuration > 0 && `/ ${formatDuration(targetDuration)}`} minutes
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
            {currentSetlist.length} song{currentSetlist.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {targetDuration > 0 && (
          <>
            <div style={{
              background: '#1F2937',
              height: '12px',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(percentage, 100)}%`,
                background: percentage > 100 ? '#EF4444' : percentage > 90 ? '#F59E0B' : '#10B981',
                transition: 'all 0.3s'
              }} />
            </div>
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#9CA3AF' }}>
              {percentage > 100 ? `⚠️ ${formatDuration(totalDuration - targetDuration)} minutes over target` :
               percentage > 90 ? '🟡 Close to target duration' :
               `✅ ${formatDuration(targetDuration - totalDuration)} minutes remaining`}
            </div>
          </>
        )}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Available Songs */}
        <div>
          <h3 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>
            Available Songs ({filteredSongs.length})
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {filteredSongs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎵</div>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>All songs added</div>
                <div style={{ fontSize: '13px' }}>All available songs have been added to your setlist</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => addToSetlist(song)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>
                      {song.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      {song.artist} • {formatDuration(song.duration_minutes)} min
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Current Setlist */}
        <div>
          <h3 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>
            Current Setlist ({currentSetlist.length} songs)
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {currentSetlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎵</div>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>No Songs Added</div>
                <div style={{ fontSize: '13px' }}>Click songs from the left to add them</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentSetlist.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#FFD700',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      flexShrink: 0
                    }}>
                      {item.position}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>
                        {item.song?.title || item.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                        {item.song?.artist || item.artist} • {formatDuration(item.song?.duration_minutes || item.duration_minutes)} min
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromSetlist(item.id)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#EF4444',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#EF4444'
                        e.currentTarget.style.color = '#ffffff'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                        e.currentTarget.style.color = '#EF4444'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
          {isSaving ? 'Creating Setlist...' : 'Create Setlist'}
        </Button>
      </div>
    </div>
  )
}
