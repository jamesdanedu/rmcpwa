'use client'

import { useState, useEffect } from 'react'
import { searchYouTube } from '../../lib/api'
import { getYouTubeThumbnail } from '../../lib/youtube-utils'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import VideoSelector from './VideoSelector'

export default function YouTubeSearch({ query, onVideoSelected, onCancel, isSubmitting }) {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const results = await searchYouTube(query)
        setVideos(results)
        
      } catch (err) {
        console.error('YouTube search error:', err)
        setError('Failed to search YouTube. Please try again.')
        setVideos([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [query])

  const formatViewCount = (count) => {
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1).replace('.0', '') + 'K'
    if (count < 1000000000) return (count / 1000000).toFixed(1).replace('.0', '') + 'M'
    return (count / 1000000000).toFixed(2).replace('.00', '').replace(/\.?0+$/, '') + 'B'
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-400 text-sm">
          Searching YouTube...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 text-2xl mb-3">⚠️</div>
        <h3 className="text-red-300 font-semibold mb-2">Search Error</h3>
        <p className="text-red-200 text-sm mb-6">{error}</p>
        
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-2xl mb-3">🔍</div>
        <h3 className="text-gray-300 font-semibold mb-2">No Results Found</h3>
        <p className="text-gray-400 text-sm mb-6">
          No videos found for "{query}". Try adjusting your search terms.
        </p>
        
        <Button variant="secondary" onClick={onCancel}>
          Back to Form
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Found {videos.length} result{videos.length !== 1 ? 's' : ''}
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>

      {/* Results */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {videos.map((video) => (
          <VideoSelector
            key={video.videoId}
            video={video}
            onSelect={() => onVideoSelected(video)}
            isSubmitting={isSubmitting}
            formatViewCount={formatViewCount}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500">
          Click on a video to select it for your song suggestion
        </p>
      </div>
    </div>
  )
}
