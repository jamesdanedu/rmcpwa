'use client'

import { useState, useEffect } from 'react'
import { getRankings } from '../../lib/api'
import RankingList from '../../features/ranking/RankingList'
import RankingFilters from '../../features/ranking/RankingFilters'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function RankingScreen() {
  const [rankings, setRankings] = useState([])
  const [filteredRankings, setFilteredRankings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    sortBy: 'ranking', // 'ranking', 'votes', 'views'
    showAll: true,
    minVotes: 0
  })

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await getRankings()
        setRankings(data)
        
      } catch (err) {
        console.error('Error loading rankings:', err)
        setError('Failed to load song rankings')
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

    setFilteredRankings(filtered)
  }, [rankings, filters])

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
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
      <div className="p-6">
        <div className="glass rounded-xl p-6 border border-red-500/20 bg-red-500/10">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-3">⚠️</div>
            <h3 className="text-red-300 font-semibold mb-2">Error</h3>
            <p className="text-red-200 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-red-300 underline text-sm hover:text-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (rankings.length === 0) {
    return (
      <div className="p-6">
        <div className="glass rounded-2xl p-8 border border-white/10 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-white mb-3">
            No Rankings Yet
          </h3>
          <p className="text-gray-400 mb-6">
            Song rankings will appear here once members start voting on suggestions.
          </p>
          
          <div className="glass rounded-xl p-4 border border-white/5">
            <h4 className="text-yellow-400 font-semibold mb-2">
              How Rankings Work
            </h4>
            <div className="text-sm text-gray-400 space-y-1">
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
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          🏆 Song Rankings
        </h2>
        <p className="text-gray-400 text-sm">
          {rankings.length} song{rankings.length !== 1 ? 's' : ''} ranked by choir votes
        </p>
      </div>

      {/* Filters */}
      <RankingFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalSongs={rankings.length}
        filteredCount={filteredRankings.length}
      />

      {/* Rankings List */}
      <RankingList rankings={filteredRankings} />
    </div>
  )
}
