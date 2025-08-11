'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getYouTubeThumbnail } from '../../lib/youtube-utils'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function RankingItem({ song, onClick, position }) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const thumbnailUrl = getYouTubeThumbnail(song.youtube_video_id, 'mqdefault')

  const formatViewCount = (count) => {
    if (!count) return '0'
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1).replace('.0', '') + 'K'
    if (count < 1000000000) return (count / 1000000).toFixed(1).replace('.0', '') + 'M'
    return (count / 1000000000).toFixed(2).replace('.00', '').replace(/\.?0+$/, '') + 'B'
  }

  const getPositionStyle = () => {
    if (position === 1) return 'from-yellow-500 to-yellow-600 text-black'
    if (position === 2) return 'from-gray-400 to-gray-500 text-black'
    if (position === 3) return 'from-amber-600 to-amber-700 text-black'
    return 'from-blue-500 to-blue-600 text-white'
  }

  const getPositionEmoji = () => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return position.toString()
  }

  const totalVotes = (song.yes_votes || 0) + (song.no_votes || 0)
  const yesPercentage = totalVotes > 0 ? Math.round((song.yes_votes / totalVotes) * 100) : 0

  return (
    <div 
      onClick={onClick}
      className="glass rounded-xl p-4 border border-white/10 cursor-pointer
                 transition-all duration-200 hover:border-yellow-400/30 
                 hover:bg-white/5 hover:transform hover:scale-[1.01]"
    >
      <div className="flex items-center gap-4">
        {/* Position Badge */}
        <div className={`
          w-12 h-12 rounded-full bg-gradient-to-br ${getPositionStyle()}
          flex items-center justify-center font-bold text-sm flex-shrink-0
          shadow-lg
        `}>
          {position <= 3 ? getPositionEmoji() : position}
        </div>

        {/* Thumbnail */}
        <div className="flex-shrink-0 w-16 h-12 bg-gray-800 rounded-lg overflow-hidden relative">
          {!imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
              <Image
                src={thumbnailUrl}
                alt={`${song.title} by ${song.artist}`}
                width={64}
                height={48}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true)
                  setImageLoading(false)
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
              🎵
            </div>
          )}
          
          {/* Play icon overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity
                          flex items-center justify-center">
            <span className="text-white text-sm">▶️</span>
          </div>
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm leading-tight mb-1 truncate">
            {song.title}
          </h4>
          <p className="text-gray-400 text-xs mb-2 truncate">
            {song.artist}
          </p>
          
          {/* Vote Statistics */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-green-400">👍</span>
              <span className="text-green-400 font-medium">{song.yes_votes}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-red-400">👎</span>
              <span className="text-red-400 font-medium">{song.no_votes}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-gray-400">📺</span>
              <span className="text-gray-400">{formatViewCount(song.youtube_view_count)}</span>
            </div>

            {totalVotes > 0 && (
              <div className="ml-auto">
                <span className="text-yellow-400 text-xs font-medium">
                  {yesPercentage}% approval
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Indicator */}
        <div className="flex-shrink-0 text-gray-400 hover:text-yellow-400 transition-colors">
          <span className="text-lg">▶️</span>
        </div>
      </div>
    </div>
  )
}
