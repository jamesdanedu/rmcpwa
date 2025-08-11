'use client'

export default function RankingFilters({ 
  filters, 
  onFiltersChange, 
  totalSongs, 
  filteredCount 
}) {
  const sortOptions = [
    { value: 'ranking', label: '🏆 By Ranking' },
    { value: 'votes', label: '🗳️ By Total Votes' },
    { value: 'views', label: '👁️ By YouTube Views' }
  ]

  const minVoteOptions = [
    { value: 0, label: 'All Songs' },
    { value: 5, label: '5+ Votes' },
    { value: 10, label: '10+ Votes' },
    { value: 20, label: '20+ Votes' }
  ]

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <h3 className="text-sm font-semibold text-yellow-400 mb-3">
          Sort & Filter
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sort By */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 font-medium">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFiltersChange({ sortBy: option.value })}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                    ${filters.sortBy === option.value
                      ? 'gradient-roscommon text-white'
                      : 'glass text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Votes Filter */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 font-medium">
              Minimum Votes
            </label>
            <div className="flex flex-wrap gap-2">
              {minVoteOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFiltersChange({ minVotes: option.value })}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                    ${filters.minVotes === option.value
                      ? 'gradient-roscommon text-white'
                      : 'glass text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {filteredCount !== totalSongs && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-xs text-gray-400">
              Showing {filteredCount} of {totalSongs} songs
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
