'use client'

import { useAppStore } from '../../stores/appStore'
import { TABS } from '../../lib/constants'

export default function TabNavigation() {
  const { currentTab, setCurrentTab } = useAppStore()

  return (
    <nav className="tab-navigation w-full border-t border-gray-200 bg-white">
      <div className="flex w-full">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`
              flex-1 flex flex-col items-center justify-center py-4 px-1
              text-xs font-medium transition-all duration-200 min-h-[80px]
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
            <div className="text-2xl mb-2">
              {tab.icon}
            </div>
            
            {/* Label */}
            <div className="text-xs font-semibold uppercase tracking-wide text-center leading-tight">
              {tab.label}
            </div>
          </button>
        ))}
      </div>
    </nav>
  )
}
