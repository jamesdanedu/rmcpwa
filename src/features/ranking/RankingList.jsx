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
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
              <th className="w-12 text-center py-3 px-2 font-bold text-sm">#</th>
              <th className="text-left py-3 px-3 font-bold text-sm">Song and Artist</th>
              <th className="w-12 text-center py-3 px-2 font-bold text-sm">👍</th>
              <th className="w-12 text-center py-3 px-2 font-bold text-sm">👎</th>
              <th className="w-16 text-center py-3 px-2 font-bold text-sm">📺</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/10">
            {rankings.map((song, index) => {
              const position = song.ranking || index + 1
              
              return (
                <tr
                  key={song.song_id || song.id || index}
                  onClick={() => handleSongClick(song)}
                  className="cursor-pointer transition-all duration-200 hover:bg-white/5"
                >
                  {/* Position */}
                  <td className="w-12 text-center py-3 px-2">
                    <div className="w-6 h-6 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 text-black
                                    flex items-center justify-center font-bold text-xs">
                      {position}
                    </div>
                  </td>

                  {/* Song and Artist */}
                  <td className="py-3 px-3">
                    <div className="min-w-0">
                      <h4 className="text-white font-semibold text-sm leading-tight mb-1 truncate">
                        {song.title}
                      </h4>
                      <p className="text-gray-400 text-xs truncate">
                        {song.artist}
                      </p>
                    </div>
                  </td>

                  {/* Yes Votes */}
                  <td className="w-12 text-center py-3 px-2">
                    <span className="text-green-400 font-medium text-sm">
                      {song.yes_votes || 0}
                    </span>
                  </td>

                  {/* No Votes */}
                  <td className="w-12 text-center py-3 px-2">
                    <span className="text-red-400 font-medium text-sm">
                      {song.no_votes || 0}
                    </span>
                  </td>

                  {/* YouTube Views */}
                  <td className="w-16 text-center py-3 px-2">
                    <span className="text-gray-400 text-xs">
                      {formatViewCount(song.youtube_view_count)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
