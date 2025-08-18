'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { checkSuggestionsRemaining } from '../../lib/api'
import SuggestionForm from '../../features/suggestions/SuggestionForm'
import SuggestionsRemaining from '../../features/suggestions/SuggestionsRemaining'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function SuggestScreen() {
  const { user } = useAuth()
  const [remainingSuggestions, setRemainingSuggestions] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Memoize the load function to prevent infinite loops
  const loadSuggestionsRemaining = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      console.log('Loading suggestions remaining for user:', user.id)
      const remaining = await checkSuggestionsRemaining(user.id)
      console.log('Loaded remaining suggestions:', remaining)
      setRemainingSuggestions(remaining)
      setError(null)
    } catch (err) {
      console.error('Error loading suggestions remaining:', err)
      setError('Failed to load suggestion limit')
      // Set to 3 as fallback
      setRemainingSuggestions(3)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id]) // Only depend on user.id

  useEffect(() => {
    loadSuggestionsRemaining()
  }, [loadSuggestionsRemaining])

  const handleSuggestionSubmitted = useCallback(() => {
    // Decrease remaining count after successful submission
    setRemainingSuggestions(prev => Math.max(0, prev - 1))
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading suggestions...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="glass rounded-xl p-6 border border-red-500/20 bg-red-500/10">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-3">⚠️</div>
            <h3 className="text-red-300 font-semibold mb-2">Error</h3>
            <p className="text-red-200 text-sm mb-4">{error}</p>
            <button
              onClick={loadSuggestionsRemaining}
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
      <SuggestionsRemaining remaining={remainingSuggestions} />
      
      {remainingSuggestions > 0 ? (
        <SuggestionForm 
          onSuggestionSubmitted={handleSuggestionSubmitted}
          remainingSuggestions={remainingSuggestions}
        />
      ) : (
        <NoSuggestionsLeft />
      )}
    </div>
  )
}

function NoSuggestionsLeft() {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1, 1)
  const nextMonthName = nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="glass rounded-2xl p-8 border border-white/10 text-center">
      <div className="text-4xl mb-4">🎵</div>
      <h3 className="text-xl font-bold text-white mb-3">
        You've used all your suggestions!
      </h3>
      <p className="text-gray-400 mb-6">
        You've reached your limit of 3 song suggestions this month. 
        New suggestions will be available in {nextMonthName}.
      </p>
      
      <div className="space-y-3">
        <div className="glass rounded-xl p-4 border border-white/5">
          <h4 className="text-yellow-400 font-semibold mb-2">
            While you wait...
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p>🗳️ Vote on other members' suggestions</p>
            <p>🏆 Check the current song rankings</p>
            <p>🎼 Browse the choir's song collection</p>
          </div>
        </div>
      </div>
    </div>
  )
}
