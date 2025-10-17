'use client'

import { useAppStore } from '../../stores/appStore'

// Define tabs directly to avoid import issues
const TABS = [
  { id: 'suggest', label: 'Suggest', icon: '💡' },
  { id: 'vote', label: 'Vote', icon: '🗳️' },
  { id: 'ranking', label: 'Ranking', icon: '🏆' },
  { id: 'choir-songs', label: 'Choir Songs', icon: '🎼' }
]

export default function TabNavigation() {
  const { currentTab, setCurrentTab } = useAppStore()

  const handleTabClick = (tabId) => {
    console.log('Clicking tab:', tabId)
    setCurrentTab(tabId)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div style={{
        width: '100%',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%'
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{ 
                flex: '1 1 25%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '12px 4px',
                fontSize: '10px',
                fontWeight: '600',
                transition: 'all 0.3s',
                position: 'relative',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minHeight: '64px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: currentTab === tab.id ? '#FFD700' : '#9CA3AF'
              }}
            >
              {/* Active indicator */}
              {currentTab === tab.id && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #FFD700, #4169E1)',
                  borderRadius: '0 0 3px 3px'
                }} />
              )}
              
              {/* Icon */}
              <span style={{ fontSize: '18px', marginBottom: '2px' }}>
                {tab.icon}
              </span>
              
              {/* Label */}
              <span style={{
                lineHeight: '1.2',
                textAlign: 'center',
                fontSize: '10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                padding: '0 2px'
              }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
