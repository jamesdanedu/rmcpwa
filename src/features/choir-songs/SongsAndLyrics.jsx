'use client'

import { useState, useEffect } from 'react'
import { getChoirSongs } from '../../../lib/api'
import { GENRES } from '../../../lib/constants'
import SongsList from './SongsList'
import LyricsModal from './LyricsModal'
import LoadingSpinner from '../../ui/LoadingSpinner'
import Input from '../../ui/Input'

export default function SongsAndLyrics() {
  const [songs, setSongs] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedSong, setSelectedSong] = useState(null)
  const [showLyricsModal, setShowLyricsModal] = useState(false)

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await getChoirSongs()
        setSongs(data)
        
      } catch (err) {
        console.error('Error loading choir songs:', err)
        setError('Failed to load choir songs')
      } finally {
        setIsLoading(false)
      }
    }

    loadSongs()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = songs

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(song => song.genre === selectedGenre)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(term) ||
        song.artist.toLowerCase().includes(term) ||
        song.genre.toLowerCase().includes(term)
      )
    }

    setFilteredSongs(filtered)
  }, [songs, selectedGenre, searchTerm])

  const handleSongClick = (song) => {
    setSelectedSong(song)
    setShowLyricsModal(true)
  }

  const handleCloseLyrics = () => {
    setShowLyricsModal(false)
    setSelectedSong(null)
  }

  // Get genre counts
  const genreCounts = songs.reduce((acc, song) => {
    acc[song.genre] = (acc[song.genre] || 0) + 1
    return acc
  }, {})

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading choir songs...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-6 border border-red-500/20 bg-red-500/10">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-3">⚠️</div>
          <h3 className="text-red-300 font-semibold mb-2">Error</h3>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (songs.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/10 text-center">
        <div className="text-4xl mb-4">🎵</div>
        <h3 className="text-xl font-bold text-white mb-3">
          No Choir Songs Yet
        </h3>
        <p className="text-gray-400 mb-6">
          The choir's song collection will appear here once songs are added.
        </p>
        
        <div className="glass rounded-xl p-4 border border-white/5">
          <h4 className="text-yellow-400 font-semibold mb-2">
            Coming Soon
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p>• Browse songs with full lyrics</p>
            <p>• Search by artist, genre, or date</p>
            <p>• View performance notes and keys</p>
            <p>• Structured lyrics with verses and chorus</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <Input
            type="text"
            placeholder="🔍 Search by artist, genre, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-base"
          />

          {/* Genre Filter */}
          <div className="glass rounded-xl p-4 border border-white/10">
            <h3 className="text-sm font-semibold text-yellow-400 mb-3">
              Filter by Genre
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre('all')}
                className={`
                  px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                  ${selectedGenre === 'all'
                    ? 'gradient-roscommon text-white'
                    : 'glass text-gray-300 hover:bg-white/10'
                  }
                `}
              >
                All ({songs.length})
              </button>
              
              {GENRES.filter(genre => genreCounts[genre] > 0).map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                    ${selectedGenre === genre
                      ? 'gradient-roscommon text-white'
                      : 'glass text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  {genre} ({genreCounts[genre]})
                </button>
              ))}
            </div>
            
            {filteredSongs.length !== songs.length && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  Showing {filteredSongs.length} of {songs.length} songs
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Songs List */}
        <SongsList 
          songs={filteredSongs} 
          onSongClick={handleSongClick}
          searchTerm={searchTerm}
        />
      </div>

      {/* Lyrics Modal */}
      <LyricsModal
        isOpen={showLyricsModal}
        onClose={handleCloseLyrics}
        song={selectedSong}
      />
    </>
  )
}
