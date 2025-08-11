'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import UserProfile from '../../features/auth/UserProfile'

export default function AppHeader() {
  const { user } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <header className="gradient-roscommon p-5 text-center shadow-lg relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-white/10 to-transparent animate-pulse" 
               style={{
                 background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                 animation: 'shimmer 3s ease-in-out infinite'
               }} />
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">
            RMCBuddy
          </h1>
          <p className="text-sm font-medium opacity-90">
            Roscommon Mens Choir
          </p>
          
          {user && (
            <button
              onClick={() => setShowProfile(true)}
              className="absolute top-4 right-4 flex items-center gap-2 text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-2 rounded-full transition-all duration-200"
            >
              <span>👤</span>
              <span className="hidden sm:inline">{user.name}</span>
            </button>
          )}
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0%, 100% { transform: translateX(-10px) translateY(-10px); }
            50% { transform: translateX(10px) translateY(10px); }
          }
        `}</style>
      </header>

      <UserProfile 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
    </>
  )
}
