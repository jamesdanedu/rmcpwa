'use client'

import { useState, useEffect } from 'react'
import { getRankings } from '../../lib/api'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function RankingScreen() {
  const [rankings, setRankings] = useState([])
  const [filteredRankings, setFilteredRankings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    sortBy: 'ranking',
    showAll: true,
    minVotes: 0
  })

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('Calling getRankings()...')
        const data = await getRankings()
        console.log('getRankings() returned:', data)
        setRankings(data || [])
        
      } catch (err) {
        console.error('Error loading rankings:', err)
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          cause: err.cause
        })
        setError(`Failed to load song rankings: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadRankings()
  }, [])

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...rankings]

    // Filter by minimum votes
    if (filters.minVotes > 0) {
      filtered = filtered.filter(song => 
        (song.yes_votes + song.no_votes) >= filters.minVotes
      )
    }

    // Sort based on selected criteria
    switch (filters.sortBy) {
      case 'votes':
        filtered.sort((a, b) => 
          (b.yes_votes + b.no_votes) - (a.yes_votes + a.no_votes)
        )
        break
      case 'views':
        filtered.sort((a, b) => 
          (b.youtube_view_count || 0) - (a.youtube_view_count || 0)
        )
        break
      case 'ranking':
      default:
        // Already sorted by ranking from database
        break
    }

    console.log('Filtered rankings:', filtered)
    setFilteredRankings(filtered)
  }, [rankings, filters])

  const getPositionColor = (position) => {
    if (position <= 3) return "bg-yellow-400"
    return "bg-blue-500"
  }

  const formatViewCount = (count) => {
    if (!count) return '0'
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1).replace('.0', '') + 'K'
    if (count < 1000000000) return (count / 1000000).toFixed(1).replace('.0', '') + 'M'
    return (count / 1000000000).toFixed(2).replace('.00', '').replace(/\.?0+$/, '') + 'B'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading song rankings...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-white">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-3">⚠️</div>
            <h3 className="text-red-700 font-semibold mb-2">Database Error</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Troubleshooting Steps:</h4>
              <ul className="text-xs text-gray-600 text-left space-y-1">
                <li>• Check if the `get_song_rankings` RPC function exists in Supabase</li>
                <li>• Verify the function has proper permissions (executable by authenticated users)</li>
                <li>• Ensure the `songs` and `votes` tables exist with the correct schema</li>
                <li>• Check browser network tab for the exact error response</li>
              </ul>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="text-red-600 underline text-sm hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (filteredRankings.length === 0) {
    return (
      <div className="p-6 bg-white">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No Rankings Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Song rankings will appear here once members start voting on suggestions.
          </p>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="text-blue-600 font-semibold mb-2">
              How Rankings Work
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Songs are ranked by number of "Yes" votes</p>
              <p>• Ties result in gaps in ranking positions</p>
              <p>• Click any song to preview the video</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-full flex flex-col">
      {/* Rankings Table Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center text-sm font-medium flex-shrink-0">
        <div className="w-12 text-center">#</div>
        <div className="flex-1">Song</div>
        <div className="w-12 text-center">👍</div>
        <div className="w-12 text-center">👎</div>
        <div className="w-16 text-center">👁</div>
      </div>

      {/* Rankings List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {filteredRankings.map((song) => (
          <div key={song.song_id} className="px-4 py-3 flex items-center hover:bg-gray-50 transition-colors">
            {/* Position Badge */}
            <div className="w-12 text-center">
              <div className={`w-8 h-8 mx-auto rounded-full ${getPositionColor(song.ranking)} text-white flex items-center justify-center text-xs font-bold`}>
                {song.ranking}
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="font-medium text-gray-900 text-sm truncate">
                {song.title}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {song.artist}
              </div>
            </div>

            {/* Vote Stats */}
            <div className="w-12 text-center">
              <span className="text-green-600 font-medium text-sm">{song.yes_votes}</span>
            </div>
            <div className="w-12 text-center">
              <span className="text-red-500 font-medium text-sm">{song.no_votes}</span>
            </div>
            <div className="w-16 text-center">
              <span className="text-blue-500 text-xs font-medium">{formatViewCount(song.youtube_view_count)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
