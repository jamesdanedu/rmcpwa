'use client'

import { useState } from 'react'

export default function RankingList({ rankings }) {
  if (!rankings || rankings.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/10 text-center">
        <div className="text-gray-400 text-2xl mb-3">🔍</div>
        <h3 className="text-gray-300 font-semibold mb-2">No Songs Found</h3>
        <p className="text-gray-400 text-sm">
          No songs have been ranked yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {rankings.map((song, index) => (
        <div
          key={song.song_id || index}
          className="glass rounded-xl p-4 border border-white/10 cursor-pointer
                     transition-all duration-200 hover:border-yellow-400/30 hover:bg-white/5"
        >
          <div className="flex items-center gap-4">
            {/* Position */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 text-black
                            flex items-center justify-center font-bold text-sm flex-shrink-0">
              {song.ranking || index + 1}
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm leading-tight mb-1">
                {song.title}
              </h4>
              <p className="text-gray-400 text-xs mb-2">
                {song.artist}
              </p>
              
              <div className="flex items-center gap-3 text-xs">
                <span className="text-green-400">👍 {song.yes_votes || 0}</span>
                <span className="text-red-400">👎 {song.no_votes || 0}</span>
                <span className="text-gray-400">📺 {song.youtube_view_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
