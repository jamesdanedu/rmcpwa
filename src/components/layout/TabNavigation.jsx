'use client'

import { useAppStore } from '../../stores/appStore'
import { TABS } from '../../lib/constants'

export default function TabNavigation() {
  const { currentTab, setCurrentTab } = useAppStore()

  return (
    <nav className="tab-navigation w-full border-t border-gray-200 bg-white">
      <div className="flex w-full h-16">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`
              flex-1 flex flex-col items-center justify-center gap-1 px-2 text-xs font-semibold
              transition-all duration-300 relative uppercase tracking-wide h-full
              ${currentTab === tab.id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {/* Active indicator */}
            {currentTab === tab.id && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-blue-600" />
            )}
            
            {/* Icon */}
            <span className="text-xl mb-1">
              {tab.icon}
            </span>
            
            {/* Label */}
            <span className="leading-tight text-center text-xs">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
