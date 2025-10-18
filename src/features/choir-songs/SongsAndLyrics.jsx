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
          <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
            Songs & Lyrics
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
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
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: '#FFFFFF',
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
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Song Content */}
            <div onClick={() => setSelectedSong(song)}>
              <h3 style={{ 
                color: '#FFFFFF', 
                fontSize: '18px', 
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {song.title}
              </h3>
              
              <p style={{ 
                color: '#9CA3AF', 
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
                  background: 'rgba(255, 215, 0, 0.1)',
                  color: '#FFD700',
                  fontWeight: '600'
                }}>
                  🎵 {song.genre}
                </span>
                
                {song.duration_minutes && (
                  <span style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(100, 116, 139, 0.2)',
                    color: '#94A3B8'
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
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(song)
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#60A5FA',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'
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
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#F87171',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
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
          color: '#9CA3AF'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#D1D5DB' }}>
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

      {/* Lyrics Modal (Existing) */}
      {selectedSong && (
        <Modal isOpen={true} onClose={() => setSelectedSong(null)} size="lg">
          <div style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #4169E1 100%)',
            padding: '24px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              {selectedSong.title}
            </h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>
              {selectedSong.artist}
            </p>
          </div>

          <div style={{
            padding: '24px',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}>
            {selectedSong.lyrics ? (
              <div style={{
                color: '#ffffff',
                fontSize: '16px',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedSong.lyrics}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: '#9CA3AF'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#D1D5DB' }}>
                  No Lyrics Available
                </p>
                <p style={{ fontSize: '14px' }}>
                  Lyrics haven't been added for this song yet.
                </p>
              </div>
            )}
          </div>

          {selectedSong.genre && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px 24px',
              display: 'flex',
              gap: '16px',
              fontSize: '12px',
              color: '#9CA3AF'
            }}>
              <span>🎵 {selectedSong.genre}</span>
              {selectedSong.duration_minutes && <span>⏱️ {selectedSong.duration_minutes} min</span>}
            </div>
          )}
        </Modal>
      )}

      {/* Song Form Modal (Create/Edit) */}
      {showForm && (
        <Modal 
          isOpen={true} 
          onClose={handleFormCancel}
          size="lg"
        >
          <div style={{ padding: '24px' }}>
            <SongForm
              initialData={editingSong}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isSubmitting}
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={handleDeleteCancel}
          size="sm"
        >
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
            
            <h3 style={{ 
              color: '#FFFFFF', 
              fontSize: '24px', 
              fontWeight: 'bold',
              marginBottom: '12px'
            }}>
              Delete Song?
            </h3>
            
            <p style={{ 
              color: '#D1D5DB',
              fontSize: '16px',
              marginBottom: '8px'
            }}>
              Are you sure you want to delete
            </p>
            
            <p style={{ 
              color: '#FFD700',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '24px'
            }}>
              "{deleteConfirm.title}"?
            </p>
            
            <p style={{ 
              color: '#9CA3AF',
              fontSize: '14px',
              marginBottom: '32px'
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
        </Modal>
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
