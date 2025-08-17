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
      <div className="app-container bg-white">
        <div className="gradient-roscommon p-5 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1 text-black">
            RMCBuddy
          </h1>
          <p className="text-sm font-medium opacity-90 text-black">
            Roscommon Mens Choir
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
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
    <div className="app-container bg-white">
      <div className="gradient-roscommon p-5 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1 text-black">
          RMCBuddy
        </h1>
        <p className="text-sm font-medium opacity-90 text-black">
          Roscommon Mens Choir
        </p>
        {user && (
          <button className="absolute top-4 right-4 flex items-center gap-2 text-xs font-medium bg-black/20 hover:bg-black/30 px-3 py-2 rounded-full transition-all duration-200">
            <span>👤</span>
            <span className="hidden sm:inline">{user.name}</span>
          </button>
        )}
      </div>
      
      <main className="main-content bg-white">
        <div className="screen-content">
          {renderScreen()}
        </div>
      </main>

      <TabNavigation />
      <PWAInstallPrompt />
    </div>
  )
}
