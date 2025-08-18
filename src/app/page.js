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
  const { currentTab } = useAppStore()
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
    
    // Also update when the address bar shows/hides on mobile
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateViewportHeight()
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', updateViewportHeight)
      window.removeEventListener('orientationchange', updateViewportHeight)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!user) {
    return (
      <div 
        className="w-full min-h-screen-mobile prevent-overscroll"
        style={{ height: viewportHeight }}
      >
        <AppHeader />
        <div className="flex items-center justify-center w-full" style={{ height: 'calc(100% - 120px)' }}>
          <div className="p-6 w-full max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
        <PWAInstallPrompt />
      </div>
    )
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'suggest': return <SuggestScreen />
      case 'vote': return <VoteScreen />
      case 'ranking': return <RankingScreen />
      case 'choir-songs': return <ChoirSongsScreen />
      default: return <SuggestScreen />
    }
  }

  return (
    <div 
      className="w-full min-h-screen-mobile prevent-overscroll flex flex-col"
      style={{ height: viewportHeight }}
    >
      <AppHeader />
      
      <main className="flex-1 overflow-hidden w-full">
        <div 
          className="h-full overflow-y-auto smooth-scroll w-full"
          style={{ 
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
            height: 'calc(100% - env(safe-area-inset-bottom, 0px))'
          }}
        >
          {renderScreen()}
        </div>
      </main>

      <TabNavigation />
      <PWAInstallPrompt />
    </div>
  )
}
