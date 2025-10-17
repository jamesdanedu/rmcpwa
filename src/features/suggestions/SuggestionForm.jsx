'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { submitSuggestion } from '../../lib/api'
import Button from '../../components/ui/Button'
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

  const updateSearchQuery = (artist, title) => {
    const query = artist && title ? `${artist} ${title}` : ''
    setSearchQuery(query)
  }

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    updateSearchQuery(newFormData.artist, newFormData.title)
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (error) setError(null)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.artist.trim()) errors.artist = 'Artist name is required'
    if (!formData.title.trim()) errors.title = 'Song title is required'
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
      setFormData({ artist: '', title: '' })
      setSearchQuery('')
      setShowYouTubeSearch(false)
      onSuggestionSubmitted()
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
              <span className="text-red-300 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
              marginBottom: '8px'
            }}>
              Artist Name
            </label>
            <input
              type="text"
              placeholder="Enter artist name..."
              value={formData.artist}
              onChange={(e) => handleInputChange('artist', e.target.value)}
              disabled={isSubmitting}
              autoComplete="off"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                fontSize: '16px',
                border: formErrors.artist ? '2px solid #EF4444' : '2px solid rgba(255, 255, 255, 0.2)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                if (!formErrors.artist) {
                  e.target.style.borderColor = '#FFD700'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)'
                }
              }}
              onBlur={(e) => {
                if (!formErrors.artist) {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.target.style.boxShadow = 'none'
                }
              }}
            />
            {formErrors.artist && (
              <p style={{ color: '#EF4444', fontSize: '12px', fontWeight: '500', marginTop: '4px' }}>
                {formErrors.artist}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
              marginBottom: '8px'
            }}>
              Song Title
            </label>
            <input
              type="text"
              placeholder="Enter song title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isSubmitting}
              autoComplete="off"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                fontSize: '16px',
                border: formErrors.title ? '2px solid #EF4444' : '2px solid rgba(255, 255, 255, 0.2)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                if (!formErrors.title) {
                  e.target.style.borderColor = '#FFD700'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)'
                }
              }}
              onBlur={(e) => {
                if (!formErrors.title) {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.target.style.boxShadow = 'none'
                }
              }}
            />
            {formErrors.title && (
              <p style={{ color: '#EF4444', fontSize: '12px', fontWeight: '500', marginTop: '4px' }}>
                {formErrors.title}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
              marginBottom: '8px'
            }}>
              YouTube Search Query
            </label>
            <input
              type="text"
              placeholder="Auto-generated search..."
              value={searchQuery}
              disabled={true}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.2)',
                color: '#9CA3AF',
                fontSize: '16px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                outline: 'none',
                cursor: 'not-allowed'
              }}
            />
          </div>

          <div style={{ paddingTop: '8px' }}>
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
        </div>
      </div>
    </div>
  )
}
