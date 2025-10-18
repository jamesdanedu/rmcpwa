// src/features/choir-songs/SongForm.jsx
'use client'

import { useState } from 'react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

/**
 * Reusable form component for creating and editing choir songs
 * 
 * @param {Object} initialData - Pre-filled data for editing (null for new songs)
 * @param {Function} onSubmit - Callback when form is submitted with valid data
 * @param {Function} onCancel - Callback when cancel button is clicked
 * @param {Boolean} isLoading - Loading state for submit button
 */
export default function SongForm({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  isLoading = false 
}) {
  const isEditMode = !!initialData

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    artist: initialData?.artist || '',
    genre: initialData?.genre || 'Pop',
    lyrics: initialData?.lyrics || '',
    durationMinutes: initialData?.duration_minutes?.toString() || '',
    dateIntroduced: initialData?.date_introduced || new Date().toISOString().split('T')[0],
    youtubeVideoId: initialData?.youtube_video_id || '',
    youtubeViewCount: initialData?.youtube_view_count?.toString() || ''
  })

  const [errors, setErrors] = useState({})

  // Available genre options
  const genres = [
    'Pop',
    'Rock', 
    'Folk',
    'Gospel',
    'Contemporary',
    'Traditional',
    'Irish Folk',
    'Christmas',
    'Hymn',
    'Jazz Standard',
    'Classical',
    'Other'
  ]

  const validate = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required'
    }
    
    if (formData.durationMinutes && isNaN(parseFloat(formData.durationMinutes))) {
      newErrors.durationMinutes = 'Must be a valid number'
    }

    if (formData.durationMinutes && parseFloat(formData.durationMinutes) < 0) {
      newErrors.durationMinutes = 'Duration cannot be negative'
    }
    
    if (formData.youtubeViewCount && isNaN(parseInt(formData.youtubeViewCount))) {
      newErrors.youtubeViewCount = 'Must be a valid number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    // Prepare data for submission
    const submitData = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      genre: formData.genre,
      lyrics: formData.lyrics.trim() || null,
      durationMinutes: formData.durationMinutes ? parseFloat(formData.durationMinutes) : null,
      dateIntroduced: formData.dateIntroduced,
      youtubeVideoId: formData.youtubeVideoId.trim() || null,
      youtubeViewCount: formData.youtubeViewCount ? parseInt(formData.youtubeViewCount) : null
    }
    
    onSubmit(submitData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-3">
          {isEditMode ? '✏️' : '🎵'}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {isEditMode ? 'Edit Song' : 'Add New Song'}
        </h3>
        <p className="text-gray-400">
          {isEditMode 
            ? 'Update the song details below' 
            : 'Fill in the song information to add it to the choir collection'
          }
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <span className="text-2xl">📋</span>
          <h4 className="text-lg font-bold text-white">Basic Information</h4>
        </div>
        
        <Input
          label="Song Title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          disabled={isLoading}
          placeholder="e.g., Amazing Grace"
          required
        />

        <Input
          label="Artist"
          type="text"
          value={formData.artist}
          onChange={(e) => handleChange('artist', e.target.value)}
          error={errors.artist}
          disabled={isLoading}
          placeholder="e.g., Traditional"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Genre <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {genres.map(genre => (
              <option key={genre} value={genre} className="bg-gray-800">
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Duration (minutes)"
            type="number"
            value={formData.durationMinutes}
            onChange={(e) => handleChange('durationMinutes', e.target.value)}
            error={errors.durationMinutes}
            disabled={isLoading}
            placeholder="e.g., 3.5"
            step="0.5"
            min="0"
          />

          <Input
            label="Date Introduced"
            type="date"
            value={formData.dateIntroduced}
            onChange={(e) => handleChange('dateIntroduced', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Lyrics Section */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <span className="text-2xl">📝</span>
          <h4 className="text-lg font-bold text-white">Lyrics</h4>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Song Lyrics
            <span className="text-gray-500 text-xs ml-2">(optional)</span>
          </label>
          <textarea
            value={formData.lyrics}
            onChange={(e) => handleChange('lyrics', e.target.value)}
            disabled={isLoading}
            placeholder="Enter the full lyrics here...&#10;&#10;Verse 1:&#10;...&#10;&#10;Chorus:&#10;..."
            rows={12}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all
                     font-mono text-sm leading-relaxed resize-y"
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Use line breaks to separate verses and sections
          </p>
        </div>
      </div>

      {/* YouTube Information Section */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <span className="text-2xl">🎥</span>
          <h4 className="text-lg font-bold text-white">YouTube Information</h4>
          <span className="text-xs text-gray-500">(optional)</span>
        </div>
        
        <Input
          label="YouTube Video ID"
          type="text"
          value={formData.youtubeVideoId}
          onChange={(e) => handleChange('youtubeVideoId', e.target.value)}
          disabled={isLoading}
          placeholder="e.g., dQw4w9WgXcQ"
        />
        <p className="text-xs text-gray-500 -mt-3">
          💡 The video ID is the part after "v=" in the YouTube URL
        </p>

        <Input
          label="YouTube View Count"
          type="number"
          value={formData.youtubeViewCount}
          onChange={(e) => handleChange('youtubeViewCount', e.target.value)}
          error={errors.youtubeViewCount}
          disabled={isLoading}
          placeholder="e.g., 1000000"
          min="0"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-white/10">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="flex-1"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading 
            ? (isEditMode ? 'Updating...' : 'Creating...') 
            : (isEditMode ? '💾 Update Song' : '➕ Create Song')
          }
        </Button>
      </div>
    </form>
  )
}
