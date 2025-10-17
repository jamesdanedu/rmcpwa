'use client'

import Modal from '../../components/ui/Modal'

export default function LyricsModal({ isOpen, onClose, song }) {
  if (!song) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #4169E1 100%)',
        padding: '24px',
        textAlign: 'center',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
          {song.title}
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>
          {song.artist}
        </p>
      </div>

      {/* Lyrics Content */}
      <div style={{
        padding: '24px',
        maxHeight: '60vh',
        overflowY: 'auto'
      }}>
        {song.lyrics ? (
          <div style={{
            color: '#ffffff',
            fontSize: '16px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            {song.lyrics}
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

      {/* Footer with metadata if available */}
      {song.genre && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '12px',
          color: '#9CA3AF'
        }}>
          <span>🎵 {song.genre}</span>
          {song.duration_minutes && <span>⏱️ {song.duration_minutes} min</span>}
        </div>
      )}
    </Modal>
  )
}
