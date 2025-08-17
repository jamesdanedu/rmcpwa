'use client'

import { useState } from 'react'
import VideoModal from '../voting/VideoModal'

export default function RankingList({ rankings }) {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)

  if (!rankings || rankings.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/10 text-center">
        <div className="text-gray-400 text-2xl mb-3">🔍</div>
        <h3 className="text-gray-300 font-semibold mb-2">No Songs Found</h3>
        <p className="text-gray-400 text-sm">
          No songs have been ranked yet.
        </p>
      </div>
    )
  }

  const handleSongClick = (song) => {
    setSelectedSong(song)
    setShowVideoModal(true)
  }

  const formatViewCount = (count) => {
    if (!count) return '0'
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1).replace('.0', '') + 'K'
    if (count < 1000000000) return (count / 1000000).toFixed(1).replace('.0', '') + 'M'
    return (count / 1000000000).toFixed(2).replace('.00', '').replace(/\.?0+$/, '') + 'B'
  }

  return (
    <>
      <div className="space-y-3">
        {rankings.map((song, index) => {
          const position = song.ranking || index + 1
          const totalVotes = (song.yes_votes || 0) + (song.no_votes || 0)
          
          return (
            <div
              key={song.song_id || song.id || index}
              onClick={() => handleSongClick(song)}
              className="glass rounded-xl p-4 border border-white/10 cursor-pointer
                         transition-all duration-200 hover:border-yellow-400/30 hover:bg-white/5"
            >
              <div className="flex items-center gap-4">
                {/* Position */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 text-black
                                flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {position}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm leading-tight mb-1">
                    {song.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2">
                    {song.artist}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-400">👍 {song.yes_votes || 0}</span>
                    <span className="text-red-400">👎 {song.no_votes || 0}</span>
                    <span className="text-gray-400">📺 {formatViewCount(song.youtube_view_count)}</span>
                    
                    {totalVotes > 0 && (
                      <span className="text-yellow-400 ml-auto">
                        {Math.round((song.yes_votes / totalVotes) * 100)}% approval
                      </span>
                    )}
                  </div>
                </div>

                {/* Play Icon */}
                <div className="flex-shrink-0 text-gray-400 hover:text-yellow-400 transition-colors">
                  <span className="text-lg">▶️</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Video Modal */}
      {selectedSong && (
        <VideoModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          song={{
            title: selectedSong.title,
            artist: selectedSong.artist,
            youtube_video_id: selectedSong.youtube_video_id
          }}
          hideVoting={true}
        />
      )}
    </>
  )
}
