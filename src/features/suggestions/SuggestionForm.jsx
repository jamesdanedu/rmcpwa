'use client'

import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { submitSuggestion } from '../../../lib/api'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import YouTubeSearch from './YouTubeSearch'

export default function SuggestionForm({ onSuggestionSubmitted, remainingSuggestions }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    artist: '',
    title: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [error, setError] = useState(null)

  // Auto-generate search query when artist and title are entered
  const updateSearchQuery = (artist, title) => {
    const query = artist && title ? `${artist} ${title}` : ''
    setSearchQuery(query)
  }

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    // Update search query
    updateSearchQuery(newFormData.artist, newFormData.title)
    
    // Clear errors
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (error) setError(null)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.artist.trim()) {
      errors.artist = 'Artist name is required'
    }
    
    if (!formData.title.trim()) {
      errors.title = 'Song title is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSearchYouTube = () => {
    if (!validateForm()) return
    
    setShowYouTubeSearch(true)
  }

  const handleVideoSelected = async (selectedVideo) => {
    try {
      setIsSubmitting(true)
      
      await submitSuggestion(
        formData.artist.trim(),
        formData.title.trim(),
        selectedVideo,
        user.id
      )

      // Reset form
      setFormData({ artist: '', title: '' })
      setSearchQuery('')
      setShowYouTubeSearch(false)
      
      // Notify parent
      onSuggestionSubmitted()
      
      // Show success (you could add a toast notification here)
      alert('Song suggestion submitted successfully! 🎵')
      
    } catch (err) {
      console.error('Error submitting suggestion:', err)
      setError(err.message || 'Failed to submit suggestion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelSearch = () => {
    setShowYouTubeSearch(false)
    setError(null)
  }

  if (showYouTubeSearch) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white mb-2">
              YouTube Search Results
            </h3>
            <p className="text-gray-400 text-sm">
              Searching for: <span className="text-yellow-400 font-medium">"{searchQuery}"</span>
            </p>
          </div>
          
          <YouTubeSearch
            query={searchQuery}
            onVideoSelected={handleVideoSelected}
            onCancel={handleCancelSearch}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="text-center mb-6">
          <div className="text-2xl mb-3">🎤</div>
          <h3 className="text-lg font-bold text-white mb-2">
            Suggest a Song
          </h3>
          <p className="text-gray-400 text-sm">
            Enter the artist and song title to search YouTube
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-sm">⚠️</span>
              <span className="text-red-300 text-sm font-medium">
                {error}
              </span>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Artist Name"
            type="text"
            placeholder="Enter artist name..."
            value={formData.artist}
            onChange={(e) => handleInputChange('artist', e.target.value)}
            error={formErrors.artist}
            disabled={isSubmitting}
            autoComplete="off"
          />

          <Input
            label="Song Title"
            type="text"
            placeholder="Enter song title..."
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={formErrors.title}
            disabled={isSubmitting}
            autoComplete="off"
          />

          <Input
            label="YouTube Search Query"
            type="text"
            placeholder="Auto-generated search..."
            value={searchQuery}
            disabled={true}
            className="bg-gray-800/50"
          />

          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSearchYouTube}
              disabled={!formData.artist.trim() || !formData.title.trim() || isSubmitting}
            >
              🔍 Search YouTube
            </Button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="glass rounded-xl p-4 border border-white/5">
        <h4 className="text-yellow-400 font-semibold mb-2 text-sm">
          💡 Tips for better results
        </h4>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Use the exact artist name and song title</p>
          <p>• Avoid extra words like "official video" or "lyrics"</p>
          <p>• Check spelling carefully before searching</p>
          <p>• You have {remainingSuggestions} suggestion{remainingSuggestions !== 1 ? 's' : ''} remaining this month</p>
        </div>
      </div>
    </div>
  )
}
