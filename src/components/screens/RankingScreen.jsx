'use client'

import { useState, useEffect } from 'react'
import { getRankings } from '../../lib/api'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function RankingScreen() {
  const [rankings, setRankings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const songsPerPage = 20

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
        setError(`Failed to load song rankings: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadRankings()
  }, [])

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

  // Pagination logic
  const totalPages = Math.ceil(rankings.length / songsPerPage)
  const startIndex = (currentPage - 1) * songsPerPage
  const endIndex = startIndex + songsPerPage
  const currentSongs = rankings.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
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

  if (rankings.length === 0) {
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
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-full flex flex-col">
      {/* Header with pagination info */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, rankings.length)} of {rankings.length} songs
          </span>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center text-sm font-medium">
        <div className="w-12 text-center">#</div>
        <div className="flex-1">Song</div>
        <div className="w-12 text-center">👍</div>
        <div className="w-12 text-center">👎</div>
        <div className="w-16 text-center">👁</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 bg-white">
        {currentSongs.map((song, index) => (
          <div key={song.song_id} className="px-4 py-3 flex items-center hover:bg-gray-50 transition-colors">
            {/* Position Badge */}
            <div className="w-12 text-center">
              <div className={`w-8 h-8 mx-auto rounded-full ${getPositionColor(song.ranking)} text-white flex items-center justify-center text-xs font-bold`}>
                {song.ranking}
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="font-medium text-gray-900 text-sm leading-tight">
                {song.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {song.artist}
              </div>
            </div>

            {/* Vote Stats */}
            <div className="w-12 text-center">
              <span className="text-green-600 font-medium text-sm">{song.yes_votes || 0}</span>
            </div>
            <div className="w-12 text-center">
              <span className="text-red-500 font-medium text-sm">{song.no_votes || 0}</span>
            </div>
            <div className="w-16 text-center">
              <span className="text-blue-500 text-xs font-medium">{formatViewCount(song.youtube_view_count)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
