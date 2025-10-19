// src/features/choir-songs/SongsAndLyrics.jsx
'use client'

import { useState, useEffect } from 'react'
import { 
  getChoirSongs,
  createChoirSong,
  updateChoirSong,
  deleteChoirSong 
} from '../../lib/api'
import { useCanEdit } from '../../hooks/useCanEdit'
import SongForm from './SongForm'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function SongsAndLyrics() {
  const { canEdit } = useCanEdit()
  
  // Existing state
  const [songs, setSongs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSong, setSelectedSong] = useState(null)
  
  // New state for CRUD operations
  const [showForm, setShowForm] = useState(false)
  const [editingSong, setEditingSong] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    loadSongs()
  }, [])

  // Auto-hide success messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const loadSongs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await getChoirSongs()
      setSongs(data || [])
      
    } catch (err) {
      console.error('Error loading choir songs:', err)
      setError('Failed to load choir songs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingSong(null)
    setShowForm(true)
  }

  const handleEdit = (song) => {
    setEditingSong(song)
    setShowForm(true)
    setSelectedSong(null) // Close lyrics modal if open
  }

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingSong) {
        // Update existing song
        await updateChoirSong(editingSong.id, formData)
        setSuccessMessage('✅ Song updated successfully!')
      } else {
        // Create new song
        await createChoirSong(formData)
        setSuccessMessage('✅ Song created successfully!')
      }
      
      // Reload songs and close form
      await loadSongs()
      setShowForm(false)
      setEditingSong(null)
      
    } catch (err) {
      console.error('Error saving song:', err)
      alert('Error: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingSong(null)
  }

  const handleDeleteClick = (song) => {
    setDeleteConfirm(song)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return
    
    try {
      await deleteChoirSong(deleteConfirm.id)
      setSuccessMessage('✅ Song deleted successfully!')
      await loadSongs()
      setDeleteConfirm(null)
      
    } catch (err) {
      console.error('Error deleting song:', err)
      alert('Error: ' + err.message)
      setDeleteConfirm(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
  }

  const handleSongClick = (song) => {
    setSelectedSong(song)
  }

  const handleCloseLyrics = () => {
    setSelectedSong(null)
  }

  const filteredSongs = songs.filter(song => 
    searchTerm === '' || 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #374151',
            borderTop: '4px solid #FFD700',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ marginTop: '16px', color: '#9CA3AF', fontSize: '14px' }}>
            Loading choir songs...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ color: '#F87171', fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
        <h3 style={{ color: '#FCA5A5', fontWeight: '600', marginBottom: '8px' }}>Error</h3>
        <p style={{ color: '#FEE2E2', fontSize: '14px' }}>{error}</p>
      </div>
    )
  }

  return (
    <div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
          zIndex: 1000,
          fontWeight: '600',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {successMessage}
        </div>
      )}

      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
            Songs & Lyrics
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            {songs.length} songs in the choir collection
          </p>
        </div>

        {/* Add New Song Button (Editors Only) */}
        {canEdit && (
          <Button
            variant="primary"
            size="md"
            onClick={handleAddNew}
          >
            ➕ Add New Song
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="🔍 Search by title, artist, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#FFFFFF',
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            color: '#000000',
            fontSize: '16px',
            outline: 'none'
          }}
        />
      </div>

      {/* Songs List */}
      <div style={{ 
        display: 'grid', 
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '2px solid #E5E7EB',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FFD700'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Song Content - Click to view lyrics */}
            <div onClick={() => handleSongClick(song)}>
              <h3 style={{ 
                color: '#000000', 
                fontSize: '18px', 
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {song.title}
              </h3>
              
              <p style={{ 
                color: '#4B5563', 
                fontSize: '14px',
                marginBottom: '12px'
              }}>
                {song.artist}
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '12px'
              }}>
                <span style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: '#FEF3C7',
                  color: '#92400E',
                  fontWeight: '600'
                }}>
                  🎵 {song.genre}
                </span>
                
                {song.duration_minutes && (
                  <span style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: '#E0E7FF',
                    color: '#3730A3'
                  }}>
                    ⏱️ {song.duration_minutes} min
                  </span>
                )}
              </div>

              {song.lyrics && (
                <p style={{ 
                  color: '#6B7280', 
                  fontSize: '12px',
                  fontStyle: 'italic'
                }}>
                  Click to view lyrics
                </p>
              )}
            </div>

            {/* Edit/Delete Buttons (Editors Only) */}
            {canEdit && (
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #E5E7EB'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(song)
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#DBEAFE',
                    border: '1px solid #3B82F6',
                    borderRadius: '8px',
                    color: '#1E40AF',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#BFDBFE'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#DBEAFE'
                  }}
                >
                  ✏️ Edit
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(song)
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#FEE2E2',
                    border: '1px solid #EF4444',
                    borderRadius: '8px',
                    color: '#991B1B',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FECACA'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FEE2E2'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredSongs.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: '#6B7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1F2937' }}>
            No songs found
          </p>
          <p style={{ fontSize: '14px' }}>
            {searchTerm 
              ? `No songs match "${searchTerm}"`
              : 'No songs in the collection yet'
            }
          </p>
        </div>
      )}

      {/* Lyrics Modal */}
      {selectedSong && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Backdrop */}
          <div 
            onClick={handleCloseLyrics}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(4px)'
            }}
          />
          
          {/* Modal Content */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            background: '#1a1a3a',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Close Button */}
            <button
              onClick={handleCloseLyrics}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #4169E1 100%)',
              padding: '32px 24px',
              textAlign: 'center',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                {selectedSong.title}
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                {selectedSong.artist}
              </p>
            </div>

            {/* Lyrics Content */}
            <div style={{
              padding: '32px',
              maxHeight: '50vh',
              overflowY: 'auto',
              background: '#1a1a3a'
            }}>
              {selectedSong.lyrics ? (
                <div style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Inter, -apple-system, sans-serif'
                }}>
                  {selectedSong.lyrics}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: '#9CA3AF'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                  <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#D1D5DB', margin: '0 0 8px 0' }}>
                    No Lyrics Available
                  </p>
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    Lyrics haven't been added for this song yet.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {(selectedSong.genre || selectedSong.duration_minutes) && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '16px 32px',
                display: 'flex',
                gap: '16px',
                fontSize: '13px',
                color: '#9CA3AF'
              }}>
                {selectedSong.genre && <span>🎵 {selectedSong.genre}</span>}
                {selectedSong.duration_minutes && <span>⏱️ {selectedSong.duration_minutes} min</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Song Form Modal (Create/Edit) */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}>
          {/* Backdrop */}
          <div 
            onClick={handleFormCancel}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(4px)'
            }}
          />
          
          {/* Modal Content */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            background: '#1a1a3a',
            borderRadius: '24px',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px'
          }}>
            {/* Close Button */}
            <button
              onClick={handleFormCancel}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            <SongForm
              initialData={editingSong}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Backdrop */}
          <div 
            onClick={handleDeleteCancel}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(4px)'
            }}
          />
          
          {/* Modal Content */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            background: '#1a1a3a',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '48px 32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '80px', marginBottom: '24px' }}>⚠️</div>
              
              <h3 style={{ 
                color: '#FFFFFF', 
                fontSize: '28px', 
                fontWeight: 'bold',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                Delete Song?
              </h3>
              
              <p style={{ 
                color: '#D1D5DB',
                fontSize: '16px',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                Are you sure you want to delete
              </p>
              
              <p style={{ 
                color: '#FFD700',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '24px',
                margin: '0 0 24px 0'
              }}>
                "{deleteConfirm.title}"?
              </p>
              
              <p style={{ 
                color: '#9CA3AF',
                fontSize: '14px',
                marginBottom: '32px',
                margin: '0 0 32px 0'
              }}>
                This action cannot be undone.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleDeleteCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDeleteConfirm}
                  className="flex-1"
                  style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                  }}
                >
                  🗑️ Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
