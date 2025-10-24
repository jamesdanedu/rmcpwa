'use client'

import { useState, useEffect } from 'react'
import { 
  createPracticeMaterial, 
  updatePracticeMaterial, 
  deletePracticeMaterial,
  uploadPracticeAudio,
  deletePracticeAudio 
} from '../../lib/api'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function PracticeMaterialEditor({ material, onClose, userId }) {
  const isEditMode = Boolean(material)
  
  const [formData, setFormData] = useState({
    title: material?.title || '',
    description: material?.description || '',
    textContent: material?.text_content || '',
    displayOrder: material?.display_order || 0
  })
  
  const [audioFile, setAudioFile] = useState(null)
  const [existingAudioUrl, setExistingAudioUrl] = useState(material?.audio_url || null)
  const [existingAudioFilename, setExistingAudioFilename] = useState(material?.audio_filename || null)
  const [removeAudio, setRemoveAudio] = useState(false)
  
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleAudioFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/m4a', 'audio/ogg', 'audio/wav']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid audio file (MP3, M4A, OGG, or WAV)')
      return
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Audio file must be less than 50MB')
      return
    }

    setAudioFile(file)
    setRemoveAudio(false)
    setError(null)
  }

  const handleRemoveAudio = () => {
    setRemoveAudio(true)
    setAudioFile(null)
  }

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a title')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      let audioUrl = existingAudioUrl
      let audioFilename = existingAudioFilename

      // Handle audio deletion
      if (removeAudio && existingAudioUrl) {
        await deletePracticeAudio(existingAudioUrl)
        audioUrl = null
        audioFilename = null
      }

      // Handle audio upload
      if (audioFile) {
        // If replacing existing audio, delete it first
        if (existingAudioUrl && !removeAudio) {
          await deletePracticeAudio(existingAudioUrl)
        }

        // Generate temporary ID for new materials
        const tempId = material?.id || `temp_${Date.now()}`
        const uploadResult = await uploadPracticeAudio(audioFile, tempId)
        audioUrl = uploadResult.url
        audioFilename = uploadResult.filename
      }

      const materialData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        textContent: formData.textContent.trim() || null,
        audioUrl,
        audioFilename,
        displayOrder: parseInt(formData.displayOrder) || 0
      }

      if (isEditMode) {
        await updatePracticeMaterial(material.id, materialData)
      } else {
        await createPracticeMaterial(materialData, userId)
      }

      onClose()
    } catch (err) {
      console.error('Error saving practice material:', err)
      setError(err.message || 'Failed to save practice material')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      // Delete audio file if it exists
      if (existingAudioUrl) {
        await deletePracticeAudio(existingAudioUrl)
      }
      
      await deletePracticeMaterial(material.id)
      onClose()
    } catch (err) {
      console.error('Error deleting practice material:', err)
      setError('Failed to delete practice material')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isEditMode ? '✏️ Edit Practice Material' : '➕ Add Practice Material'}
        </h2>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-red-400 text-xl">⚠️</span>
            <span className="text-red-300 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Hallelujah Chorus - Part Practice"
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
            maxLength={255}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of this practice material..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none"
            maxLength={500}
          />
        </div>

        {/* Text Content */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Lyrics / Notes (Optional)
          </label>
          <textarea
            value={formData.textContent}
            onChange={(e) => handleInputChange('textContent', e.target.value)}
            placeholder="Enter lyrics, practice notes, or instructions..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 resize-none font-mono text-sm"
          />
        </div>

        {/* Audio Upload */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Audio File (Optional)
          </label>
          
          {/* Existing Audio */}
          {existingAudioUrl && !removeAudio && !audioFile && (
            <div className="glass rounded-xl p-4 border border-green-400/20 bg-green-400/5 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">🎵</span>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {existingAudioFilename || 'Audio file attached'}
                    </p>
                    <p className="text-gray-400 text-xs">Current audio</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveAudio}
                  className="px-3 py-1 text-red-400 text-sm hover:bg-red-400/10 rounded-lg transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* New Audio File */}
          {audioFile && (
            <div className="glass rounded-xl p-4 border border-blue-400/20 bg-blue-400/5 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 text-xl">🎵</span>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {audioFile.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAudioFile(null)}
                  className="px-3 py-1 text-red-400 text-sm hover:bg-red-400/10 rounded-lg transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!audioFile && !existingAudioUrl || removeAudio && (
            <label className="block">
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/mp4,audio/m4a,audio/ogg,audio/wav"
                onChange={handleAudioFileChange}
                className="hidden"
              />
              <div className="glass rounded-xl p-4 border border-white/10 cursor-pointer hover:border-yellow-400/30 transition-all text-center">
                <span className="text-2xl block mb-2">📁</span>
                <span className="text-white font-medium">Choose Audio File</span>
                <p className="text-gray-400 text-xs mt-1">
                  MP3, M4A, OGG, or WAV (Max 50MB)
                </p>
              </div>
            </label>
          )}
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={formData.displayOrder}
            onChange={(e) => handleInputChange('displayOrder', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
            min="0"
          />
          <p className="text-gray-400 text-xs mt-1">
            Lower numbers appear first (0 = default)
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              Saving...
            </span>
          ) : (
            isEditMode ? '💾 Save Changes' : '➕ Create Material'
          )}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={onClose}
          disabled={isSaving || isDeleting}
        >
          Cancel
        </Button>

        {isEditMode && (
          <Button
            variant="danger"
            size="lg"
            className="w-full"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? 'Deleting...' : '🗑️ Delete Material'}
          </Button>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 border border-white/10 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-3">
              Delete Practice Material?
            </h3>
            <p className="text-gray-300 mb-6">
              This will permanently delete "{material.title}" and cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
