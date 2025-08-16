'use client'

import { useAppStore } from '../../stores/appStore'
import { TABS } from '../../lib/constants'

export default function TabNavigation() {
  const { currentTab, setCurrentTab } = useAppStore()

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm border-t border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
    >
      <div className="flex w-full">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`
              flex flex-col items-center justify-center gap-1 py-4 px-2
              text-xs font-semibold uppercase tracking-wide
              transition-colors duration-200 relative
              ${currentTab === tab.id 
                ? 'text-yellow-400' 
                : 'text-gray-400'
              }
            `}
            style={{ 
              width: '25%',
              minHeight: '60px'
            }}
          >
            {/* Active indicator */}
            {currentTab === tab.id && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-blue-500" />
            )}
            
            {/* Icon */}
            <span className="text-lg">
              {tab.icon}
            </span>
            
            {/* Label */}
            <span className="text-center leading-tight">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
