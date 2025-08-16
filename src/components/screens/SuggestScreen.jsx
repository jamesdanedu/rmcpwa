'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const loadSuggestionsRemaining = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        const remaining = await checkSuggestionsRemaining(user.id)
        setRemainingSuggestions(remaining)
      } catch (err) {
        console.error('Error loading suggestions remaining:', err)
        setError('Failed to load suggestion limit')
      } finally {
        setIsLoading(false)
      }
    }

    loadSuggestionsRemaining()
  }, [user])

  const handleSuggestionSubmitted = () => {
    // Decrease remaining count after successful submission
    setRemainingSuggestions(prev => Math.max(0, prev - 1))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white">
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
      <div className="p-6 bg-white">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-3">⚠️</div>
            <h3 className="text-red-700 font-semibold mb-2">Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-full">
      <div className="p-4 space-y-4">
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
    </div>
  )
}

function NoSuggestionsLeft() {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1, 1)
  const nextMonthName = nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
      <div className="text-4xl mb-4">🎵</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        You've used all your suggestions!
      </h3>
      <p className="text-gray-600 mb-6">
        You've reached your limit of 3 song suggestions this month. 
        New suggestions will be available in {nextMonthName}.
      </p>
      
      <div className="space-y-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="text-blue-600 font-semibold mb-2">
            While you wait...
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>🗳️ Vote on other members' suggestions</p>
            <p>🏆 Check the current song rankings</p>
            <p>🎼 Browse the choir's song collection</p>
          </div>
        </div>
      </div>
    </div>
  )
}
