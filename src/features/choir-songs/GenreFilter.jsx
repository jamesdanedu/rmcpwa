'use client'

import { GENRES } from '../../../lib/constants'

export default function GenreFilter({ 
  availableSongs, 
  selectedGenre, 
  onGenreChange, 
  filteredCount 
}) {
  // Calculate genre counts
  const genreCounts = availableSongs.reduce((acc, song) => {
    acc[song.genre] = (acc[song.genre] || 0) + 1
    return acc
  }, {})

  const totalSongs = availableSongs.length

  return (
    <div className="glass rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-yellow-400 mb-3">
        Filter by Genre
      </h3>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGenreChange('all')}
          className={`
            px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
            ${selectedGenre === 'all'
              ? 'gradient-roscommon text-white'
              : 'glass text-gray-300 hover:bg-white/10'
            }
          `}
        >
          All ({totalSongs})
        </button>
        
        {GENRES.filter(genre => genreCounts[genre] > 0).map((genre) => (
          <button
            key={genre}
            onClick={() => onGenreChange(genre)}
            className={`
              px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
              ${selectedGenre === genre
                ? 'gradient-roscommon text-white'
                : 'glass text-gray-300 hover:bg-white/10'
              }
            `}
          >
            {genre} ({genreCounts[genre]})
          </button>
        ))}
      </div>
      
      {filteredCount !== totalSongs && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-400">
            Showing {filteredCount} available songs
          </p>
        </div>
      )}
    </div>
  )
}
