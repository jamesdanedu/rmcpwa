'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getSongsForVoting, submitVote } from '../../lib/api'
import VotingCard from '../features/voting/VotingCard'
import VotingStats from '../features/voting/VotingStats'
import NoSongsToVote from '../features/voting/NoSongsToVote'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function VoteScreen() {
  const { user } = useAuth()
  const [currentVote, setCurrentVote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState(null)
  const [votingStats, setVotingStats] = useState({ songsToVote: 0, votedToday: 0 })

  const loadNextSong = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const vote = await getSongsForVoting(user.id)
      setCurrentVote(vote)
      
      // TODO: Get actual voting stats from API
      // For now, using mock data
      setVotingStats({
        songsToVote: vote ? 12 : 0,
        votedToday: 8
      })
      
    } catch (err) {
      console.error('Error loading song for voting:', err)
      setError('Failed to load song for voting')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNextSong()
  }, [user])

  const handleVote = async (voteType) => {
    if (!currentVote || isVoting) return
    
    try {
      setIsVoting(true)
      
      await submitVote(currentVote.id, voteType)
      
      // Update stats
      setVotingStats(prev => ({
        songsToVote: Math.max(0, prev.songsToVote - 1),
        votedToday: prev.votedToday + 1
      }))
      
      // Load next song
      await loadNextSong()
      
    } catch (err) {
      console.error('Error submitting vote:', err)
      setError('Failed to submit vote. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading songs to vote on...
          </p>
        </div>
      </div>
    )
  }

  if (error && !currentVote) {
    return (
      <div className="p-6">
        <div className="glass rounded-xl p-6 border border-red-500/20 bg-red-500/10">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-3">⚠️</div>
            <h3 className="text-red-300 font-semibold mb-2">Error</h3>
            <p className="text-red-200 text-sm mb-4">{error}</p>
            <button
              onClick={loadNextSong}
              className="text-red-300 underline text-sm hover:text-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-6">
      <VotingStats stats={votingStats} />
      
      {currentVote ? (
        <VotingCard
          vote={currentVote}
          onVote={handleVote}
          isVoting={isVoting}
          error={error}
          onClearError={() => setError(null)}
        />
      ) : (
        <NoSongsToVote />
      )}
    </div>
  )
}
