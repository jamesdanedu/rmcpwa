'use client'

import { useEffect } from 'react'
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

  useEffect(() => {
    init()
  }, [init])

  if (!user) {
    return (
      <div className="app-container">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-6">
          <LoginForm />
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
    <div className="app-container">
      <AppHeader />
      
      <main className="pb-20">
        {renderScreen()}
      </main>

      <TabNavigation />
      <PWAInstallPrompt />
    </div>
  )
}
