'use client'

import { useEffect, useRef } from 'react'
import { getYouTubeEmbedUrl } from '../../../lib/youtube-utils'
import Modal from '../../ui/Modal'
import VotingButtons from './VotingButtons'

export default function VideoModal({ isOpen, onClose, song, onVote, isVoting }) {
  const iframeRef = useRef(null)

  useEffect(() => {
    // Clean up video when modal closes
    if (!isOpen && iframeRef.current) {
      iframeRef.current.src = ''
    }
  }, [isOpen])

  if (!song) return null

  const embedUrl = getYouTubeEmbedUrl(song.youtube_video_id, {
    autoplay: 1,
    controls: 1,
    modestbranding: 1,
    rel: 0
  })

  const handleVoteAndClose = (voteType) => {
    onVote(voteType)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <div className="p-6">
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
          {embedUrl ? (
            <iframe
              ref={iframeRef}
              src={isOpen ? embedUrl : ''}
              title={`${song.title} by ${song.artist}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">🎵</div>
                <div className="text-sm">Video unavailable</div>
              </div>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white mb-1">
            {song.title}
          </h3>
          <p className="text-gray-400">
            {song.artist}
          </p>
        </div>

        {/* Voting Buttons */}
        <VotingButtons
          onVote={handleVoteAndClose}
          isVoting={isVoting}
          disabled={isVoting}
        />

        {/* Note */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Voting will close this preview and load the next song
          </p>
        </div>
      </div>
    </Modal>
  )
}
