'use client'

import { useAppStore } from '../../stores/appStore'
import { TABS } from '../../lib/constants'

export default function TabNavigation() {
  const { currentTab, setCurrentTab } = useAppStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 bg-slate-900/90 border-t border-white/10">
      <div className="max-w-[430px] mx-auto">
        <div className="flex w-full" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold
                transition-all duration-300 relative uppercase tracking-wide
                ${currentTab === tab.id 
                  ? 'text-yellow-400' 
                  : 'text-gray-400 hover:text-gray-200'
                }
              `}
            >
              {/* Active indicator */}
              {currentTab === tab.id && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-500" />
              )}
              
              {/* Icon */}
              <span className="text-lg">
                {tab.icon}
              </span>
              
              {/* Label */}
              <span className="leading-tight">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
