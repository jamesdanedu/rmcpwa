import { useState, useEffect } from 'react'

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const installPWA = async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
    
    return outcome === 'accepted'
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
  }

  return {
    canInstall: !!deferredPrompt,
    showInstallPrompt,
    installPWA,
    dismissInstallPrompt
  }
}
