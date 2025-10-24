'use client'

import { useState } from 'react'
import SuggestScreen from './SuggestScreen'
import VoteScreen from './VoteScreen'
import RankingScreen from './RankingScreen'

export default function IdeasScreen() {
  const [activeTab, setActiveTab] = useState('suggest')

  const tabs = [
    { id: 'suggest', label: 'Suggest' },
    { id: 'vote', label: 'Vote' },
    { id: 'rankings', label: 'Rankings' }
  ]

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
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation - matches ChoirSongsScreen style */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '16px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #FFD700 0%, #4169E1 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab.id ? 'white' : '#D1D5DB',
              backdropFilter: 'blur(20px)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {renderTabContent()}
    </div>
  )
}
