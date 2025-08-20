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
    <div
      className="fixed bottom-0 left-0 w-screen z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="w-full bg-slate-900/95 backdrop-blur-lg border-t border-white/10">
        <div className="grid grid-cols-4 w-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                w-full flex flex-col items-center gap-1 py-3 px-2 text-xs font-semibold
                transition-all duration-300 relative uppercase tracking-wide
                min-h-[60px] min-w-0
                ${currentTab === tab.id
                  ? 'text-yellow-400'
                  : 'text-gray-400 hover:text-gray-200 active:text-gray-100'
                }
              `}
            >
              {/* Active indicator */}
              {currentTab === tab.id && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-b-sm" />
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
