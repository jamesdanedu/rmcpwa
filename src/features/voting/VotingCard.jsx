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
      {/* Full-height voting card that fills available space */}
      <div className="flex flex-col h-full min-h-[600px] glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/20 border-b border-red-500/30 p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-lg">⚠️</span>
              <span className="text-red-300 text-sm font-medium flex-1">
                {error}
              </span>
              {onClearError && (
                <button
                  onClick={onClearError}
                  className="text-red-300 hover:text-red-200 text-xl font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main content area - fills remaining space */}
        <div className="flex-1 flex flex-col p-6 text-center">
          
          {/* Song Image - takes up significant space */}
          <div className="flex-1 flex items-center justify-center mb-6">
            <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-xl">
              <div className="w-full h-full bg-gray-800 relative">
                {!imageError ? (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <p className="mt-3 text-gray-400 text-sm">Loading video...</p>
                        </div>
                      </div>
                    )}
                    <Image
                      src={thumbnailUrl}
                      alt={`${song.title} by ${song.artist}`}
                      fill
                      className={`object-cover transition-all duration-500 ${
                        imageLoading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                      } group-hover:scale-105`}
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageError(true)
                        setImageLoading(false)
                      }}
                      onClick={handleImageClick}
                      priority
                    />
                  </>
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
                    onClick={handleImageClick}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎵</div>
                      <div className="text-lg font-medium">Click to play video</div>
                      <div className="text-sm opacity-75">Thumbnail unavailable</div>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Play Overlay */}
                {!imageError && (
                  <div 
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                               transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                    onClick={handleImageClick}
                  >
                    <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                      <span className="text-black text-3xl ml-1">▶️</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <div className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                        Click to preview video
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Song Info - centered and prominent */}
          <div className="mb-8 px-4">
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
              {song.title}
            </h1>
            <p className="text-xl text-gray-300 mb-4 font-medium">
              {song.artist}
            </p>
            <div className="flex items-center justify-center gap-6 text-base text-gray-400">
              <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                <span className="text-lg">👁️</span>
                <span className="font-medium">{formatViewCount(song.youtube_view_count)} views</span>
              </span>
            </div>
          </div>

          {/* Voting Buttons - directly below video */}
          <div className="mb-6">
            <VotingButtons
              onVote={onVote}
              isVoting={isVoting}
              disabled={isVoting}
            />
          </div>

          {/* Instructions - subtle but helpful */}
          <div className="pt-4 border-t border-white/10 flex-shrink-0">
            <p className="text-sm text-gray-500 leading-relaxed">
              🎵 <span className="font-medium">Click the image</span> to preview the song
              <br />
              Vote if you'd like the choir to add this to their repertoire
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
