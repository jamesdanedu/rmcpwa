'use client'

import { useState } from 'react'
import SongsAndLyrics from '../../features/choir-songs/SongsAndLyrics'
import SetLists from '../../features/choir-songs/SetLists'

export default function ChoirSongsScreen() {
  const [activeView, setActiveView] = useState('songs') // 'songs' or 'setlists'

  const views = [
    { id: 'songs', label: '📝 Songs & Lyrics', component: SongsAndLyrics },
    { id: 'setlists', label: '🎼 Set Lists', component: SetLists }
  ]

  const ActiveComponent = views.find(view => view.id === activeView)?.component

  return (
    <div className="p-5 space-y-6">
      {/* Navigation */}
      <div className="flex gap-3">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`
              flex-1 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200
              ${activeView === view.id
                ? 'gradient-roscommon text-white shadow-lg'
                : 'glass text-gray-300 border border-white/10 hover:bg-white/10'
              }
            `}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Authentication Notice for Setlists */}
      {activeView === 'setlists' && (
        <div className="glass rounded-xl p-3 border border-yellow-400/30 bg-yellow-400/10">
          <div className="flex items-center gap-2 text-yellow-400">
            <span className="text-sm">🔒</span>
            <span className="text-xs font-medium">
              Setlist management requires authentication. Auto-archive after 30 days post-event.
            </span>
          </div>
        </div>
      )}

      {/* Active View */}
      {ActiveComponent && <ActiveComponent />}
    </div>
  )
}
