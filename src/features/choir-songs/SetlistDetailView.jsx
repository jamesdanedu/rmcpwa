'use client'

import { useAuth } from '../../hooks/useAuth'
import { isAfter } from 'date-fns'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'
import LyricsModal from './LyricsModal'

export default function SetlistDetailView({ 
  isOpen, 
  onClose, 
  setlist, 
  onEdit,
  onGeneratePDF,
  isGeneratingPDF 
}) {
  const { user, isAuthenticated } = useAuth()
  const [selectedSong, setSelectedSong] = useState(null)
  const [isLyricsModalOpen, setIsLyricsModalOpen] = useState(false)

  console.log('SetlistDetailView rendered, isOpen:', isOpen, 'setlist:', setlist)

  useEffect(() => {
    if (isOpen) {
      console.log('Modal is open, preventing body scroll')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        console.log('Escape pressed, closing modal')
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !setlist) {
    console.log('Modal not rendering because isOpen=', isOpen, 'or no setlist')
    return null
  }

  console.log('Modal rendering with setlist:', setlist.name)

  const eventDate = new Date(setlist.event_date)
  const isUpcoming = isAfter(eventDate, new Date())
  
  const canEdit = isAuthenticated && 
                  !setlist.is_archived && 
                  setlist.created_by === user?.id

  const formatTime = (timeString) => {
    if (!timeString) return null
    try {
      const [hours, minutes] = timeString.split(':')
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes))
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } catch {
      return timeString
    }
  }

  const handleOpenMaps = () => {
    if (setlist.eircode) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(setlist.eircode)}`
      window.open(mapsUrl, '_blank')
    }
  }

  const handleSongClick = (song) => {
    console.log('Song clicked:', song.title)
    setSelectedSong(song)
    setIsLyricsModalOpen(true)
  }

  const handleCloseLyricsModal = () => {
    setIsLyricsModalOpen(false)
    setSelectedSong(null)
  }

  const getGenreColor = (genre) => {
    const colors = {
      'Christmas': 'background: #dc2626; color: white',
      'Irish Folk': 'background: #16a34a; color: white',
      'Gospel': 'background: #7c3aed; color: white',
      'Hymn': 'background: #0891b2; color: white',
      'Contemporary': 'background: #db2777; color: white',
      'Jazz Standard': 'background: #ea580c; color: white',
      'Classical': 'background: #4f46e5; color: white',
      'Traditional': 'background: #65a30d; color: white'
    }
    return colors[genre] || 'background: #6b7280; color: white'
  }

  const modalContent = (
    <div>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      
      {/* Modal Container */}
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        pointerEvents: 'none'
      }}>
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #111127 0%, #1a1a3a 100%)',
            borderRadius: '24px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'auto',
            animation: 'scaleIn 0.2s ease-out'
          }}
        >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #4169E1 100%)',
          padding: '24px',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'white',
              margin: 0
            }}>
              {setlist.name}
            </h2>
            {isUpcoming && !setlist.is_archived && (
              <span style={{
                fontSize: '11px',
                background: 'rgba(34, 197, 94, 0.3)',
                color: '#d1fae5',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '600'
              }}>
                Upcoming
              </span>
            )}
            {setlist.is_archived && (
              <span style={{
                fontSize: '11px',
                background: 'rgba(107, 114, 128, 0.3)',
                color: '#e5e7eb',
                padding: '4px 10px',
                borderRadius: '999px',
                fontWeight: '600'
              }}>
                Archived
              </span>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '16px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            <span>📅 {eventDate.toLocaleDateString()}</span>
            {setlist.event_time && <span>🕐 {formatTime(setlist.event_time)}</span>}
            {setlist.total_duration_minutes && <span>⏱️ {setlist.total_duration_minutes} minutes</span>}
            <span>🎵 {setlist.song_count || setlist.songs?.length || 0} songs</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          maxHeight: 'calc(90vh - 200px)',
          overflowY: 'auto'
        }}>
          {/* Venue Information */}
          {(setlist.eircode || setlist.venue_notes) && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#fbbf24',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📍 Venue Information
              </h3>
              
              {setlist.eircode && (
                <button
                  onClick={handleOpenMaps}
                  style={{
                    fontSize: '14px',
                    color: '#60a5fa',
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: setlist.venue_notes ? '8px' : '0'
                  }}
                >
                  <span style={{ fontFamily: 'monospace' }}>{setlist.eircode}</span>
                  <span style={{ fontSize: '12px' }}>→ Open in Maps</span>
                </button>
              )}
              
              {setlist.venue_notes && (
                <p style={{
                  fontSize: '14px',
                  color: '#d1d5db',
                  margin: 0
                }}>
                  {setlist.venue_notes}
                </p>
              )}
            </div>
          )}

          {/* Song List */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#fbbf24',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎼 Setlist Order (Click a song to view lyrics)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {setlist.songs && setlist.songs.length > 0 ? (
                setlist.songs.map((song, index) => (
                  <div 
                    key={song.id || index}
                    onClick={() => handleSongClick(song)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
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
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FFD700, #4169E1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '14px',
                          margin: '0 0 4px 0',
                          lineHeight: '1.4'
                        }}>
                          {song.title}
                        </h4>
                        <p style={{
                          color: '#9ca3af',
                          fontSize: '12px',
                          margin: '0 0 8px 0'
                        }}>
                          {song.artist}
                        </p>
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          flexWrap: 'wrap', 
                          gap: '8px'
                        }}>
                          {song.genre && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              ...Object.fromEntries(getGenreColor(song.genre).split('; ').map(s => s.split(': ')))
                            }}>
                              {song.genre}
                            </span>
                          )}
                          
                          {song.duration_minutes && (
                            <span style={{
                              fontSize: '12px',
                              color: '#6b7280'
                            }}>
                              ⏱️ {song.duration_minutes} min
                            </span>
                          )}
                          
                          <span style={{
                            fontSize: '11px',
                            color: song.lyrics ? '#10B981' : '#6B7280'
                          }}>
                            📝 {song.lyrics ? 'Lyrics available' : 'No lyrics yet'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '48px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎵</div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                    No songs in this setlist
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {canEdit && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  onEdit(setlist)
                  onClose()
                }}
                style={{ flex: 1 }}
              >
                ✏️ Edit Setlist
              </Button>
            )}
            
            <Button
              variant="primary"
              size="md"
              onClick={() => onGeneratePDF(setlist.id)}
              loading={isGeneratingPDF}
              disabled={isGeneratingPDF}
              style={{ flex: 1 }}
            >
              {isGeneratingPDF ? 'Generating...' : '📄 Download PDF'}
            </Button>
            
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
    
    {/* Lyrics Modal */}
    {isLyricsModalOpen && selectedSong && (
      <LyricsModal
        isOpen={isLyricsModalOpen}
        onClose={handleCloseLyricsModal}
        song={selectedSong}
      />
    )}
    </div>
  )

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null
}
