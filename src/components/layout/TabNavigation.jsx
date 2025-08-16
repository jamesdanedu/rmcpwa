'use client'

import { useAppStore } from '../../stores/appStore'
import { TABS } from '../../lib/constants'

export default function TabNavigation() {
  const { currentTab, setCurrentTab } = useAppStore()

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] z-50">
      <div className="glass bg-slate-900/80 backdrop-filter backdrop-blur-[20px] border-t border-white/10">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`
                flex-1 padding-12px-8px text-center border-none bg-none cursor-pointer
                transition-all duration-300 relative text-10px font-semibold uppercase tracking-wide
                flex flex-col items-center gap-4px
                ${currentTab === tab.id 
                  ? 'text-yellow-400' 
                  : 'text-gray-400'
                }
              `}
              style={{ 
                padding: '12px 8px',
                fontSize: '10px',
                letterSpacing: '0.5px'
              }}
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
              <span>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
