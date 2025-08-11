'use client'

import { useAuth } from '../../hooks/useAuth'

export default function AppHeader() {
  const { user, logout } = useAuth()

  return (
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
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="text-xs font-medium bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-all duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-10px) translateY(-10px); }
          50% { transform: translateX(10px) translateY(10px); }
        }
      `}</style>
    </header>
  )
}
