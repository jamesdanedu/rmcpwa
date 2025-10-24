'use client'

import { useState } from 'react'
import SuggestScreen from './SuggestScreen'
import VoteScreen from './VoteScreen'
import RankingScreen from './RankingScreen'

const IDEAS_TABS = [
  { id: 'suggest', label: 'Suggest' },
  { id: 'vote', label: 'Vote' },
  { id: 'rankings', label: 'Rankings' }
]

export default function IdeasScreen() {
  const [activeTab, setActiveTab] = useState('suggest')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'suggest':
        return <SuggestScreen key="suggest" />
      case 'vote':
        return <VoteScreen key="vote" />
      case 'rankings':
        return <RankingScreen key="rankings" />
      default:
        return <SuggestScreen key="default" />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top Tabs Navigation */}
      <div className="flex-shrink-0 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-xl">
        <div className="flex items-center">
          {IDEAS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-4 text-sm font-semibold uppercase tracking-wide
                transition-all relative
                ${activeTab === tab.id
                  ? 'text-yellow-400'
                  : 'text-gray-400 hover:text-gray-300'
                }
              `}
            >
              {tab.label}
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-blue-500"
                  style={{ 
                    borderRadius: '4px 4px 0 0' 
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
