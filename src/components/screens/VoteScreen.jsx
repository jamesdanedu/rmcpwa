'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getSongsForVoting, submitVote } from '../../lib/api'
import VotingCard from '../../features/voting/VotingCard'
import VotingStats from '../../features/voting/VotingStats'
import NoSongsToVote from '../../features/voting/NoSongsToVote'
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
      
      // Update voting stats
      setVotingStats(prev => ({
        songsToVote: vote ? Math.max(0, prev.songsToVote) : 0,
        votedToday: prev.votedToday
      }))
      
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 gradient-roscommon rounded-2xl flex items-center justify-center text-3xl animate-pulse">
            🗳️
          </div>
          <LoadingSpinner size="lg" />
          <h3 className="mt-6 text-xl font-bold text-white mb-2">
            Loading Songs to Vote On
          </h3>
          <p className="text-gray-400 text-sm max-w-sm">
            Finding new song suggestions for you to review...
          </p>
        </div>
      </div>
    )
  }

  if (error && !currentVote) {
    return (
      <div className="flex flex-col min-h-[70vh] p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="glass rounded-2xl p-8 border border-red-500/20 bg-red-500/10 max-w-md w-full">
            <div className="text-center">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h3 className="text-red-300 font-bold text-lg mb-3">Error Loading Songs</h3>
              <p className="text-red-200 text-sm mb-6 leading-relaxed">{error}</p>
              <button
                onClick={loadNextSong}
                className="w-full gradient-roscommon text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-140px)]">
      {/* Stats Header - compact but informative */}
      <div className="flex-shrink-0 p-4 pb-2">
        <VotingStats stats={votingStats} />
      </div>
      
      {/* Main Content Area - fills remaining space */}
      <div className="flex-1 p-4 pt-2">
        {currentVote ? (
          <VotingCard
            vote={currentVote}
            onVote={handleVote}
            isVoting={isVoting}
            error={error}
            onClearError={() => setError(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <NoSongsToVote />
          </div>
        )}
      </div>
    </div>
  )
}
