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
    console.log('=== TAB CLICK DEBUG ===')
    console.log('Clicked tab ID:', tabId)
    console.log('Current tab before:', currentTab)
    
    // Force re-render by using a slightly different approach
    setTimeout(() => {
      setCurrentTab(tabId)
      console.log('Tab set to:', tabId)
    }, 0)
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 w-full z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="w-full bg-white/95 backdrop-blur-lg border-t border-gray-300 shadow-lg">
        <div className="flex w-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-semibold
                transition-all duration-300 relative uppercase tracking-wide
                min-h-[60px] min-w-0
                ${currentTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700 active:text-gray-900'
                }
              `}
            >
              {/* Active indicator */}
              {currentTab === tab.id && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-sm" />
              )}
              
              {/* Icon */}
              <span className="text-lg mb-1">
                {tab.icon}
              </span>
              
              {/* Label */}
              <span className="leading-tight text-center text-xs">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
