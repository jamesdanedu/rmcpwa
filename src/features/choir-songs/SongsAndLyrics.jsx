'use client'

import { useState, useEffect } from 'react'
import { getChoirSongs } from '../../lib/api'

export default function SongsAndLyrics() {
  const [songs, setSongs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSong, setSelectedSong] = useState(null)

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Load actual songs from database
        const data = await getChoirSongs()
        setSongs(data || [])
        
      } catch (err) {
        console.error('Error loading choir songs:', err)
        setError('Failed to load choir songs')
      } finally {
        setIsLoading(false)
      }
    }

    loadSongs()
  }, [])

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="🔍 Search by artist, genre, or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
            fontSize: '16px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            outline: 'none',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#FFD700'
            e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Songs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredSongs.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '48px 24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: '#D1D5DB', fontWeight: '600', marginBottom: '8px' }}>
              No Songs Found
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          filteredSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => setSelectedSong(song)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(20px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <h4 style={{
                color: '#1a1a1a',
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '4px',
                lineHeight: '1.4'
              }}>
                {song.title}
              </h4>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>
                  {song.artist}
                </span>
                <span style={{ color: '#6B7280' }}>•</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#FFD700',
                  background: 'rgba(255, 215, 0, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {song.genre}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '12px',
                color: '#6B7280'
              }}>
                {song.duration_minutes && (
                  <span>⏱️ {song.duration_minutes} min</span>
                )}
                <span style={{ color: song.lyrics ? '#10B981' : '#6B7280' }}>
                  📝 {song.lyrics ? 'Lyrics available' : 'No lyrics yet'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Simple Lyrics Modal */}
      {selectedSong && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedSong(null)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #111127 0%, #1a1a3a 100%)',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #4169E1 100%)',
              padding: '24px',
              textAlign: 'center',
              color: 'white'
            }}>
              <button
                onClick={() => setSelectedSong(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                ×
              </button>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                {selectedSong.title}
              </h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>
                {selectedSong.artist}
              </p>
            </div>

            {/* Lyrics Content */}
            <div style={{
              padding: '24px',
              maxHeight: 'calc(80vh - 180px)',
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

            {/* Footer */}
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
          </div>
        </div>
      )}
    </div>
  )
}
