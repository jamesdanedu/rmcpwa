'use client'

import { usePWA } from '../../hooks/usePWA'
import { useState, useEffect } from 'react'

export default function PWAInstallPrompt() {
  const { showInstallPrompt, installPWA, dismissInstallPrompt } = usePWA()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (showInstallPrompt) {
      // Show prompt after 2 seconds delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [showInstallPrompt])

  const handleInstall = async () => {
    const installed = await installPWA()
    if (installed) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    dismissInstallPrompt()
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className={`
      fixed bottom-20 left-4 right-4 max-w-[390px] mx-auto z-50
      transform transition-transform duration-300 ease-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1">
              📱 Install RMCBuddy
            </div>
            <div className="text-xs opacity-90">
              Quick access and offline features!
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Install
            </button>
            
            <button
              onClick={handleDismiss}
              className="bg-white/10 hover:bg-white/20 w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
