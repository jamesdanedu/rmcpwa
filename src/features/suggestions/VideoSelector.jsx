'use client'

import { useState } from 'react'
import Image from 'next/image'
import LoadingSpinner from '../../ui/LoadingSpinner'

export default function VideoSelector({ video, onSelect, isSubmitting, formatViewCount }) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleSelect = () => {
    if (isSubmitting) return
    onSelect(video)
  }

  return (
    <div 
      onClick={handleSelect}
      className={`
        glass rounded-xl p-4 border border-white/10 cursor-pointer
        transition-all duration-200 hover:border-yellow-400/30 hover:bg-white/10
        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-[1.02]'}
      `}
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-24 h-18 bg-gray-800 rounded-lg overflow-hidden relative">
          {!imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={96}
                height={72}
                className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
              <span className="text-black text-sm ml-0.5">▶</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm leading-tight mb-1 line-clamp-2">
            {video.title}
          </h4>
          
          <p className="text-gray-400 text-xs mb-2">
            {video.channelTitle}
          </p>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>👁️ {formatViewCount(video.viewCount)}</span>
            {isSubmitting && (
              <div className="flex items-center gap-1">
                <LoadingSpinner size="sm" />
                <span>Submitting...</span>
              </div>
            )}
          </div>
        </div>

        {/* Select button */}
        <div className="flex-shrink-0 flex items-center">
          <div className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm
            transition-colors duration-200
            ${isSubmitting 
              ? 'border-gray-500 text-gray-500' 
              : 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
            }
          `}>
            {isSubmitting ? '⏳' : '+'}
          </div>
        </div>
      </div>
    </div>
  )
}
