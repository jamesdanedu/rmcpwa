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
      <div className="glass rounded-xl overflow-hidden border border-white/10">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-3">
          <div className="flex items-center font-bold text-xs">
            <div className="w-8 text-center">#</div>
            <div className="flex-1 min-w-0 px-2">Song and Artist</div>
            <div className="w-10 text-center">👍</div>
            <div className="w-10 text-center">👎</div>
            <div className="w-16 text-center">📺</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/10">
          {rankings.map((song, index) => {
            const position = song.ranking || index + 1
            
            return (
              <div
                key={song.song_id || song.id || index}
                onClick={() => handleSongClick(song)}
                className="px-3 py-3 cursor-pointer transition-all duration-200 hover:bg-white/5"
              >
                <div className="flex items-center text-sm">
                  {/* Position */}
                  <div className="w-8 text-center">
                    <div className="w-6 h-6 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 text-black
                                    flex items-center justify-center font-bold text-xs">
                      {position}
                    </div>
                  </div>

                  {/* Song and Artist */}
                  <div className="flex-1 min-w-0 px-2">
                    <h4 className="text-white font-semibold text-sm leading-tight mb-1 truncate">
                      {song.title}
                    </h4>
                    <p className="text-gray-400 text-xs truncate">
                      {song.artist}
                    </p>
                  </div>

                  {/* Yes Votes */}
                  <div className="w-10 text-center">
                    <span className="text-green-400 font-medium text-sm">
                      {song.yes_votes || 0}
                    </span>
                  </div>

                  {/* No Votes */}
                  <div className="w-10 text-center">
                    <span className="text-red-400 font-medium text-sm">
                      {song.no_votes || 0}
                    </span>
                  </div>

                  {/* YouTube Views */}
                  <div className="w-16 text-center">
                    <span className="text-gray-400 text-xs">
                      {formatViewCount(song.youtube_view_count)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
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
