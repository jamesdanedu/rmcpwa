'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getSetlists, createSetlist, updateSetlist, deleteSetlist, getSetlistById } from '../../lib/api'
import { getChoirSongs } from '../../lib/api'
import { exportSetlistToPDF } from '../../lib/pdf-export'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

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

  const handleEditClick = async (setlist) => {
    try {
      const fullSetlist = await getSetlistById(setlist.id)
      setEditingSetlist(fullSetlist)
      setShowCreator(true)
    } catch (err) {
      console.error('Error loading setlist:', err)
      alert('Failed to load setlist for editing')
    }
  }

  const handleSetlistSaved = () => {
    setShowCreator(false)
    setEditingSetlist(null)
    loadSetlists()
  }

  const handleCancel = () => {
    setShowCreator(false)
    setEditingSetlist(null)
  }

  const handleExport = async (setlist) => {
    try {
      const fullSetlist = await getSetlistById(setlist.id)
      await exportSetlistToPDF(fullSetlist)
    } catch (err) {
      console.error('Error exporting PDF:', err)
      alert('Failed to export PDF. Please try again.')
    }
  }

  if (showCreator) {
    return (
      <SetlistCreator
        setlist={editingSetlist}
        onSave={handleSetlistSaved}
        onCancel={handleCancel}
        userId={user.id}
      />
    )
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
          <p style={{ marginTop: '16px', color: '#9CA3AF', fontSize: '14px' }}>
            Loading setlists...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleCreateClick}
      >
        ➕ Create New Setlist
      </Button>

      {setlists.length === 0 ? (
        <NoSetlists />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {setlists.map((setlist) => (
            <SetlistCard
              key={setlist.id}
              setlist={setlist}
              onEdit={() => handleEditClick(setlist)}
              onExport={() => handleExport(setlist)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function NoSetlists() {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      padding: '48px 24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎼</div>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: '12px'
      }}>
        No Setlists Yet
      </h3>
      <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px' }}>
        Create your first setlist to organize songs for performances.
      </p>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <h4 style={{ color: '#FFD700', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
          Setlist Features
        </h4>
        <div style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'left' }}>
          <p>• Add/remove songs with drag-and-drop ordering</p>
          <p>• Automatic duration calculation</p>
          <p>• Filter songs by genre</p>
          <p>• Export to PDF with lyrics</p>
        </div>
      </div>
    </div>
  )
}

function SetlistCard({ setlist, onEdit, onExport }) {
  const eventDate = new Date(setlist.event_date)
  const isUpcoming = eventDate > new Date()

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)'
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h4 style={{
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              {setlist.name}
            </h4>
            {isUpcoming && (
              <span style={{
                fontSize: '10px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: '600'
              }}>
                UPCOMING
              </span>
            )}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '12px',
            color: '#9CA3AF',
            marginBottom: '8px'
          }}>
            <span>📅 {eventDate.toLocaleDateString()}</span>
            {setlist.total_duration_minutes && (
              <span>⏱️ {setlist.total_duration_minutes} min</span>
            )}
            {setlist.song_count && (
              <span>🎵 {setlist.song_count} songs</span>
            )}
          </div>

          {setlist.venue_notes && (
            <p style={{ fontSize: '12px', color: '#6B7280' }}>
              📍 {setlist.venue_notes}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          ✏️ Edit
        </button>
        
        <button
          onClick={onExport}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255, 215, 0, 0.2)',
            color: '#FFD700',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 215, 0, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)'}
        >
          📄 Export PDF
        </button>
      </div>
    </div>
  )
}

function SetlistCreator({ setlist, onSave, onCancel, userId }) {
  const [formData, setFormData] = useState({
    name: setlist?.name || '',
    eventDate: setlist?.event_date || '',
    venueNotes: setlist?.venue_notes || ''
  })
  const [availableSongs, setAvailableSongs] = useState([])
  const [selectedSongs, setSelectedSongs] = useState(setlist?.songs || [])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSongs()
  }, [])

  const loadSongs = async () => {
    try {
      setIsLoading(true)
      const songs = await getChoirSongs()
      setAvailableSongs(songs || [])
    } catch (err) {
      console.error('Error loading songs:', err)
      setError('Failed to load songs')
    } finally {
      setIsLoading(false)
    }
  }

  const addSong = (song) => {
    setSelectedSongs(prev => [...prev, { ...song, position: prev.length + 1 }])
  }

  const removeSong = (songId) => {
    setSelectedSongs(prev => {
      const filtered = prev.filter(s => s.id !== songId)
      return filtered.map((s, idx) => ({ ...s, position: idx + 1 }))
    })
  }

  const moveSong = (fromIndex, toIndex) => {
    setSelectedSongs(prev => {
      const newList = [...prev]
      const [moved] = newList.splice(fromIndex, 1)
      newList.splice(toIndex, 0, moved)
      return newList.map((s, idx) => ({ ...s, position: idx + 1 }))
    })
  }

  const totalDuration = selectedSongs.reduce((sum, song) => sum + (song.duration_minutes || 0), 0)

  const filteredAvailableSongs = availableSongs.filter(song => {
    const notInSetlist = !selectedSongs.find(s => s.id === song.id)
    const matchesGenre = selectedGenre === 'all' || song.genre?.includes(selectedGenre)
    return notInSetlist && matchesGenre
  })

  const uniqueGenres = [...new Set(availableSongs.flatMap(s => s.genre?.split(',').map(g => g.trim()) || []))].filter(Boolean)

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Setlist name is required')
      return
    }
    if (!formData.eventDate) {
      setError('Event date is required')
      return
    }
    if (selectedSongs.length === 0) {
      setError('Add at least one song')
      return
    }

    try {
      setIsSaving(true)
      
      const setlistData = {
        name: formData.name,
        eventDate: formData.eventDate,
        venueNotes: formData.venueNotes,
        totalDuration: Math.round(totalDuration * 100) / 100
      }

      if (setlist?.id) {
        await updateSetlist(setlist.id, setlistData, selectedSongs)
      } else {
        await createSetlist(setlistData, selectedSongs, userId)
      }
      
      onSave()
    } catch (err) {
      console.error('Error saving setlist:', err)
      setError('Failed to save setlist. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
          {setlist ? 'Edit Setlist' : '🎼 Create New Setlist'}
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
          Add songs and organize your performance
        </p>
      </div>

      {/* Form */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#FCA5A5', fontSize: '14px' }}>⚠️ {error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#FCA5A5',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#E5E7EB', marginBottom: '8px' }}>
              Setlist Name
            </label>
            <input
              type="text"
              placeholder="e.g., Spring Concert 2025"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#E5E7EB', marginBottom: '8px' }}>
              Event Date
            </label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#E5E7EB', marginBottom: '8px' }}>
            Venue/Notes
          </label>
          <textarea
            placeholder="e.g., Roscommon Arts Centre - acoustic venue"
            value={formData.venueNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, venueNotes: e.target.value }))}
            rows={2}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              color: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              fontSize: '14px',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Duration Tracker */}
      <div style={{
        background: 'rgba(255, 215, 0, 0.1)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700', marginBottom: '4px' }}>
          {totalDuration.toFixed(1)} minutes
        </div>
        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
          {selectedSongs.length} song{selectedSongs.length !== 1 ? 's' : ''} in setlist
        </div>
      </div>

      {/* Genre Filter */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#E5E7EB', marginBottom: '8px' }}>
          Filter by Genre
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedGenre('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: selectedGenre === 'all' ? 'linear-gradient(135deg, #FFD700, #4169E1)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {uniqueGenres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: selectedGenre === genre ? 'linear-gradient(135deg, #FFD700, #4169E1)' : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Available Songs */}
        <div>
          <h3 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>
            Available Songs ({filteredAvailableSongs.length})
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px',
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {filteredAvailableSongs.map(song => (
              <div
                key={song.id}
                onClick={() => addSong(song)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                  {song.title}
                </div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                  {song.artist} • {song.duration_minutes} min
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Songs */}
        <div>
          <h3 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>
            Setlist Order ({selectedSongs.length})
          </h3>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px',
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {selectedSongs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280', fontSize: '12px' }}>
                No songs added yet. Click songs from the left to add them.
              </div>
            ) : (
              selectedSongs.map((song, idx) => (
                <div
                  key={song.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFD700, #4169E1)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#ffffff', 
                      marginBottom: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {song.title}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#9CA3AF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {song.artist} • {song.duration_minutes} min
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    {idx > 0 && (
                      <button
                        onClick={() => moveSong(idx, idx - 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ↑
                      </button>
                    )}
                    {idx < selectedSongs.length - 1 && (
                      <button
                        onClick={() => moveSong(idx, idx + 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: 'none',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ↓
                      </button>
                    )}
                    <button
                      onClick={() => removeSong(song.id)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          variant="secondary"
          size="lg"
          onClick={onCancel}
          disabled={isSaving}
          style={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving || selectedSongs.length === 0}
          style={{ flex: 1 }}
        >
          {isSaving ? 'Saving...' : setlist ? 'Update Setlist' : 'Create Setlist'}
        </Button>
      </div>
    </div>
  )
}
