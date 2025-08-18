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
    <div className="p-5 space-y-6 bg-white min-h-full">
      {/* Navigation */}
      <div className="flex gap-3">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            disabled={true} // Disabled since they're not useable yet
            className={`
              flex-1 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200
              bg-gray-300 text-gray-500 border border-gray-400 cursor-not-allowed
            `}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Disabled Notice */}
      <div className="glass rounded-xl p-4 border border-gray-300 bg-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">🚧</span>
          <span className="text-xs font-medium">
            Choir songs and setlist features are coming soon. Currently in development.
          </span>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="glass rounded-xl p-8 border border-gray-300 bg-gray-50 text-center">
        <div className="text-gray-400 text-2xl mb-3">🎼</div>
        <h3 className="text-gray-600 font-semibold mb-2">Feature Coming Soon</h3>
        <p className="text-gray-500 text-sm">
          The choir songs and setlist management features are currently under development.
        </p>
      </div>
    </div>
  )
}
