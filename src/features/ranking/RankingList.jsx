'use client'

import { useState } from 'react'
import RankingItem from './RankingItem'
import VideoModal from '../voting/VideoModal'

export default function RankingList({ rankings }) {
  const [selectedSong, setSelectedSong] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const handleSongClick = (song) => {
    // Convert ranking data to song format for video modal
    const songData = {
      id: song.song_id,
      title: song.title,
      artist: song.artist,
      youtube_video_id: song.youtube_video_id,
      youtube_view_count: song.youtube_view_count
    }
    
    setSelectedSong(songData)
    setShowVideoModal(true)
  }

  const handleCloseModal = () => {
    setShowVideoModal(false)
    setSelectedSong(null)
  }

  if (rankings.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/10 text-center">
        <div className="text-gray-400 text-2xl mb-3">🔍</div>
        <h3 className="text-gray-300 font-semibold mb-2">No Songs Found</h3>
        <p className="text-gray-400 text-sm">
          Try adjusting your filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {rankings.map((song, index) => (
          <RankingItem
            key={song.song_id}
            song={song}
            onClick={() => handleSongClick(song)}
            position={song.ranking}
          />
        ))}
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={handleCloseModal}
        song={selectedSong}
        onVote={() => {}} // No voting in rankings view
        isVoting={false}
        hideVoting={true} // We'll add this prop
      />
    </>
  )
}
