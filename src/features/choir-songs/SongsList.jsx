'use client'

import { formatDistanceToNow } from 'date-fns'

export default function SongsList({ songs, onSongClick, searchTerm }) {
  const highlightText = (text, term) => {
    if (!term.trim()) return text
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400/30 text-yellow-300 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const getGenreColor = (genre) => {
    const colors = {
      'Christmas': 'text-red-400',
      'Irish Folk': 'text-green-400',
      'Gospel': 'text-purple-400',
      'Hymn': 'text-blue-400',
      'Contemporary': 'text-cyan-400',
      'Jazz Standard': 'text-amber-400',
      'Classical': 'text-indigo-400',
      'Traditional': 'text-gray-400'
    }
    return colors[genre] || 'text-gray-400'
  }

  if (songs.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/10 text-center">
        <div className="text-gray-400 text-2xl mb-3">🔍</div>
        <h3 className="text-gray-300 font-semibold mb-2">No Songs Found</h3>
        <p className="text-gray-400 text-sm">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {songs.map((song) => (
        <div
          key={song.id}
          onClick={() => onSongClick(song)}
          className="glass rounded-xl p-4 border border-white/10 cursor-pointer
                     transition-all duration-200 hover:border-yellow-400/30 
                     hover:bg-white/5 hover:transform hover:scale-[1.01]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm leading-tight mb-1">
                {highlightText(song.title, searchTerm)}
              </h4>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400 text-xs">
                  {highlightText(song.artist, searchTerm)}
                </span>
                <span className="text-gray-600">•</span>
                <span className={`text-xs font-medium ${getGenreColor(song.genre)}`}>
                  {song.genre}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {song.duration_minutes && (
                  <span>⏱️ {song.duration_minutes} min</span>
                )}
                
                {song.date_introduced && (
                  <span>
                    📅 Added {formatDistanceToNow(new Date(song.date_introduced), { addSuffix: true })}
                  </span>
                )}

                {song.performance_notes?.difficulty && (
                  <span>
                    ⭐ {song.performance_notes.difficulty}/5
                  </span>
                )}
              </div>
            </div>

            {/* Action Indicator */}
            <div className="flex-shrink-0 text-gray-400 hover:text-yellow-400 transition-colors ml-4">
              <span className="text-lg">📖</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
