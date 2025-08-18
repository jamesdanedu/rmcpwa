'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useAppStore } from '../stores/appStore'

import AppHeader from '../components/layout/AppHeader'
import TabNavigation from '../components/layout/TabNavigation'
import PWAInstallPrompt from '../components/layout/PWAInstallPrompt'

import SuggestScreen from '../components/screens/SuggestScreen'
import VoteScreen from '../components/screens/VoteScreen'
import RankingScreen from '../components/screens/RankingScreen'
import ChoirSongsScreen from '../components/screens/ChoirSongsScreen'

import LoginForm from '../features/auth/LoginForm'

export default function Home() {
  const { user, init } = useAuthStore()
  const { currentTab, setCurrentTab } = useAppStore()
  const [viewportHeight, setViewportHeight] = useState('100vh')

  useEffect(() => {
    init()
  }, [init])

  // Handle dynamic viewport height for mobile browsers
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      setViewportHeight(`${window.innerHeight}px`)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    window.addEventListener('orientationchange', updateViewportHeight)

    return () => {
      window.removeEventListener('resize', updateViewportHeight)
      window.removeEventListener('orientationchange', updateViewportHeight)
    }
  }, [])

  // Debug current tab
  useEffect(() => {
    console.log('Current tab changed to:', currentTab)
  }, [currentTab])

  if (!user) {
    return (
      <div 
        className="w-full min-h-screen flex flex-col"
        style={{ 
          height: viewportHeight,
          background: 'linear-gradient(135deg, #111127 0%, #1a1a3a 100%)'
        }}
      >
        <AppHeader />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm mx-auto">
            <LoginForm />
          </div>
        </div>
        <PWAInstallPrompt />
      </div>
    )
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'suggest': 
        return <SuggestScreen key="suggest" />
      case 'vote': 
        return <VoteScreen key="vote" />
      case 'ranking': 
        return <RankingScreen key="ranking" />
      case 'choir-songs': 
        return <ChoirSongsScreen key="choir-songs" />
      default: 
        return <SuggestScreen key="default" />
    }
  }

  return (
    <div 
      className="w-full min-h-screen flex flex-col"
      style={{ 
        height: viewportHeight,
        background: 'linear-gradient(135deg, #111127 0%, #1a1a3a 100%)'
      }}
    >
      {/* Header - fixed height */}
      <div className="flex-shrink-0">
        <AppHeader />
      </div>
      
      {/* Main content - fills remaining space */}
      <main className="flex-1 overflow-hidden w-full">
        <div 
          className="h-full w-full overflow-y-auto"
          style={{ 
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 20px))'
          }}
        >
          {renderScreen()}
        </div>
      </main>

      {/* Fixed bottom navigation */}
      <div className="flex-shrink-0">
        <TabNavigation />
      </div>
      
      <PWAInstallPrompt />
    </div>
  )
}
