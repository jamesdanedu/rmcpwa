'use client'

import { useState, useEffect } from 'react'
import { getChoirSongs } from '../../../lib/api'
import { GENRES } from '../../../lib/constants'
import LoadingSpinner from '../../ui/LoadingSpinner'
import Input from '../../ui/Input'

export default function SongsAndLyrics() {
  const [songs, setSongs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Mock data for now since we don't have actual choir songs
        const mockSongs = [
          {
            id: '1',
            title: 'Amazing Grace',
            artist: 'Traditional',
            genre: 'Gospel',
            duration_minutes: 4,
            date_introduced: '2024-12-01'
          },
          {
            id: '2',
            title: 'Danny Boy',
            artist: 'Traditional Irish',
            genre: 'Irish Folk',
            duration_minutes: 5,
            date_introduced: '2024-11-15'
          }
        ]
        
        setSongs(mockSongs)
        
      } catch (err) {
        console.error('Error loading choir songs:', err)
        setError('Failed to load choir songs')
      } finally {
        setIsLoading(false)
      }
    }

    loadSongs()
  }, [])

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

  return (
    <div className="space-y-6">
      <Input
        type="text"
        placeholder="🔍 Search by artist, genre, or date..."
        className="text-base"
      />

      <div className="space-y-3">
        {songs.map((song) => (
          <div
            key={song.id}
            className="glass rounded-xl p-4 border border-white/10 cursor-pointer
                       transition-all duration-200 hover:border-yellow-400/30 hover:bg-white/5"
          >
            <h4 className="text-white font-semibold text-sm mb-1">
              {song.title}
            </h4>
            <p className="text-gray-400 text-xs">
              {song.artist} • {song.genre} • {song.duration_minutes} min
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
