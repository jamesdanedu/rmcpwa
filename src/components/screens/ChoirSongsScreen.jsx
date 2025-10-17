'use client'

import { useState } from 'react'
import SongsAndLyrics from '../../features/choir-songs/SongsAndLyrics'

export default function ChoirSongsScreen() {
  const [activeView, setActiveView] = useState('songs') // 'songs' or 'setlists'

  const views = [
    { id: 'songs', label: '📝 Songs & Lyrics' },
    { id: 'setlists', label: '🎼 Set Lists' }
  ]

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            style={{
              flex: 1,
              padding: '16px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: activeView === view.id 
                ? 'linear-gradient(135deg, #FFD700 0%, #4169E1 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              color: activeView === view.id ? 'white' : '#D1D5DB',
              backdropFilter: 'blur(20px)'
            }}
            onMouseEnter={(e) => {
              if (activeView !== view.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeView !== view.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Active View */}
      {activeView === 'songs' ? (
        <SongsAndLyrics />
      ) : (
        <SetListsPlaceholder />
      )}
    </div>
  )
}

function SetListsPlaceholder() {
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
        Set Lists Coming Soon
      </h3>
      <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
        The setlist management features are currently under development.
      </p>
    </div>
  )
}
