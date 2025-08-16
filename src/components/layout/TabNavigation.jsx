'use client'

import { useAppStore } from '../../stores/appStore'
import { TABS } from '../../lib/constants'

export default function TabNavigation() {
  const { currentTab, setCurrentTab } = useAppStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50">
      <div className="max-w-[430px] mx-auto glass bg-slate-900/80 border-t border-white/10">
        <div className="flex w-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-2 text-xs font-semibold
                transition-all duration-300 relative uppercase tracking-wide min-w-0
                ${currentTab === tab.id 
                  ? 'text-yellow-400' 
                  : 'text-gray-400 hover:text-gray-200'
                }
              `}
              style={{ width: '25%', height: '8vh' }}
            >
              {/* Active indicator */}
              {currentTab === tab.id && (
                <div className="absolute top-0 left-0 right-0 h-0.5 gradient-roscommon rounded-b-sm" />
              )}
              
              {/* Icon */}
              <span className="text-lg mb-0.5">
                {tab.icon}
              </span>
              
              {/* Label */}
              <span className="leading-tight text-center">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
