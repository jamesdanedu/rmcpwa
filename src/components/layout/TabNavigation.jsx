'use client'

import { useAppStore } from '../../stores/appStore'
import { TABS } from '../../lib/constants'

export default function TabNavigation() {
  const { currentTab, setCurrentTab } = useAppStore()

  return (
    <nav 
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="glass bg-slate-900/90 border-t border-white/10 backdrop-blur-lg">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`
                flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-semibold
                transition-all duration-300 relative uppercase tracking-wide touch-target
                ${currentTab === tab.id 
                  ? 'text-yellow-400' 
                  : 'text-gray-400 hover:text-gray-200 active:text-gray-100'
                }
              `}
              style={{
                minHeight: '44px', // iOS touch target minimum
                minWidth: '44px'
              }}
            >
              {/* Active indicator */}
              {currentTab === tab.id && (
                <div className="absolute top-0 left-0 right-0 h-0.5 gradient-roscommon rounded-b-sm" />
              )}
              
              {/* Icon */}
              <span className="text-lg mb-0.5 transition-transform duration-200 hover:scale-110">
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
