'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getYouTubeThumbnail } from '../../lib/youtube-utils'
import VotingButtons from './VotingButtons'
import VideoModal from './VideoModal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function VotingCard({ vote, onVote, isVoting, error, onClearError }) {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  if (!vote?.songs) return null

  const song = vote.songs
  const thumbnailUrl = getYouTubeThumbnail(song.youtube_video_id, 'maxresdefault')

  const formatViewCount = (count) => {
    if (!count) return '0'
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1).replace('.0', '') + 'K'
    if (count < 1000000000) return (count / 1000000).toFixed(1).replace('.0', '') + 'M'
    return (count / 1000000000).toFixed(2).replace('.00', '').replace(/\.?0+$/, '') + 'B'
  }

  const handleImageClick = () => {
    if (onClearError) onClearError()
    setShowVideoModal(true)
  }

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden border border-white/10">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border-b border-red-500/30 p-3">
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-sm">⚠️</span>
              <span className="text-red-300 text-sm font-medium">
                {error}
              </span>
              {onClearError && (
                <button
                  onClick={onClearError}
                  className="ml-auto text-red-300 hover:text-red-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        <div className="p-6 text-center">
          {/* Song Image */}
          <div className="relative w-full max-w-80 mx-auto mb-6 rounded-2xl overflow-hidden cursor-pointer group">
            <div className="aspect-video bg-gray-800 relative">
              {!imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingSpinner size="lg" />
                    </div>
                  )}
                  <Image
                    src={thumbnailUrl}
                    alt={`${song.title} by ${song.artist}`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true)
                      setImageLoading(false)
                    }}
                    onClick={handleImageClick}
                  />
                </>
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-gray-500 cursor-pointer"
                  onClick={handleImageClick}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎵</div>
                    <div className="text-sm">Click to play video</div>
                  </div>
                </div>
              )}
              
              {/* Play Overlay */}
              {!imageError && (
                <div 
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                             transition-opacity duration-300 flex items-center justify-center"
                  onClick={handleImageClick}
                >
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-black text-2xl ml-1">▶️</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Song Info */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2 leading-tight">
              {song.title}
            </h2>
            <p className="text-lg text-gray-300 mb-3">
              {song.artist}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                👁️ {formatViewCount(song.youtube_view_count)} views
              </span>
            </div>
          </div>

          {/* Voting Buttons */}
          <VotingButtons
            onVote={onVote}
            isVoting={isVoting}
            disabled={isVoting}
          />

          {/* Instructions */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500">
              🎵 Click the image to preview • Vote if you'd like the choir to sing this song
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        song={song}
        onVote={onVote}
        isVoting={isVoting}
      />
    </>
  )
}
