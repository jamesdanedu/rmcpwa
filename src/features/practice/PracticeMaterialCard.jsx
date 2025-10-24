'use client'

import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function PracticeMaterialCard({ material, isEditor, onEdit, onClick }) {
  const [showDetail, setShowDetail] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)

  const hasText = Boolean(material.text_content)
  const hasAudio = Boolean(material.audio_url)

  const handleCardClick = () => {
    setShowDetail(true)
    if (onClick) onClick(material)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    onEdit()
  }

  const handlePlayAudio = () => {
    if (!hasAudio) return
    
    const audio = new Audio(material.audio_url)
    setIsPlaying(true)
    setAudioError(false)

    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => {
      setIsPlaying(false)
      setAudioError(true)
    }

    audio.play().catch(err => {
      console.error('Error playing audio:', err)
      setIsPlaying(false)
      setAudioError(true)
    })
  }

  return (
    <>
      <div 
        className="glass rounded-xl p-4 border border-white/5 cursor-pointer hover:border-yellow-400/30 transition-all"
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">
              {material.title}
            </h3>
            
            {material.description && (
              <p className="text-gray-400 text-sm mb-3">
                {material.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs">
              {hasText && (
                <span className="flex items-center gap-1 text-blue-400">
                  📄 Text
                </span>
              )}
              {hasAudio && (
                <span className="flex items-center gap-1 text-green-400">
                  🎵 Audio
                </span>
              )}
              {!hasText && !hasAudio && (
                <span className="text-gray-500">No content</span>
              )}
            </div>
          </div>

          {isEditor && (
            <button
              onClick={handleEditClick}
              className="flex-shrink-0 px-3 py-2 rounded-lg glass border border-blue-400/20 text-blue-400 text-sm hover:bg-blue-400/10 transition-all"
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={material.title}
        size="md"
      >
        <div className="p-6 space-y-6">
          {/* Description */}
          {material.description && (
            <div className="text-gray-300 text-sm">
              {material.description}
            </div>
          )}

          {/* Text Content */}
          {hasText && (
            <div className="glass rounded-xl p-4 border border-white/5">
              <h4 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                📄 Lyrics / Notes
              </h4>
              <div className="text-white whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
                {material.text_content}
              </div>
            </div>
          )}

          {/* Audio Player */}
          {hasAudio && (
            <div className="glass rounded-xl p-4 border border-white/5">
              <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                🎵 Audio Track
              </h4>
              
              <div className="space-y-3">
                {/* Native HTML5 Audio Player */}
                <audio 
                  controls 
                  className="w-full"
                  style={{
                    height: '40px',
                    borderRadius: '8px'
                  }}
                >
                  <source src={material.audio_url} type="audio/mpeg" />
                  <source src={material.audio_url} type="audio/mp4" />
                  <source src={material.audio_url} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>

                {/* Audio filename */}
                {material.audio_filename && (
                  <p className="text-xs text-gray-400 text-center">
                    {material.audio_filename}
                  </p>
                )}

                {audioError && (
                  <p className="text-xs text-red-400 text-center">
                    ⚠️ Error loading audio file
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!hasText && !hasAudio && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-400">
                No content available for this practice material
              </p>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setShowDetail(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}
