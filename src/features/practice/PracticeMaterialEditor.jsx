'use client'

import { useState } from 'react'
import { 
  createPracticeMaterial, 
  updatePracticeMaterial, 
  deletePracticeMaterial,
  uploadPracticeAudio,
  deletePracticeAudio 
} from '../../lib/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
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
        <p className="text-gray-400 text-sm">
          {isEditMode ? 'Update the practice material details' : 'Create a new practice material for the choir'}
        </p>
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

      {/* Form Container */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
        {/* Title */}
        <Input
          label="Title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="e.g., Hallelujah Chorus - Tenor Practice"
          required
          maxLength={255}
        />

        {/* Description */}
        <Input
          label="Description (Optional)"
          as="textarea"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of this practice material..."
          rows={2}
          maxLength={500}
          className="resize-none"
        />

        {/* Text Content */}
        <Input
          label="Lyrics / Notes (Optional)"
          as="textarea"
          value={formData.textContent}
          onChange={(e) => handleInputChange('textContent', e.target.value)}
          placeholder="Enter lyrics, practice notes, or instructions..."
          rows={8}
          className="resize-none font-mono text-sm"
        />

        {/* Audio Upload Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Audio File (Optional)
          </label>
          
          {/* Existing Audio */}
          {existingAudioUrl && !removeAudio && !audioFile && (
            <div className="glass rounded-xl p-4 border border-green-400/20 bg-green-400/5 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎵</span>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {existingAudioFilename || 'Audio file attached'}
                    </p>
                    <p className="text-gray-400 text-xs">Current audio</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAudio}
                  className="px-3 py-2 text-red-400 text-sm hover:bg-red-400/10 rounded-lg transition-all font-semibold"
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
                  <span className="text-2xl">🎵</span>
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
                  type="button"
                  onClick={() => setAudioFile(null)}
                  className="px-3 py-2 text-red-400 text-sm hover:bg-red-400/10 rounded-lg transition-all font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {(!audioFile && (!existingAudioUrl || removeAudio)) && (
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/mp4,audio/m4a,audio/ogg,audio/wav"
                onChange={handleAudioFileChange}
                className="hidden"
              />
              <div className="glass rounded-xl p-6 border-2 border-dashed border-white/20 hover:border-yellow-400/50 transition-all text-center">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-white font-semibold mb-1">Choose Audio File</p>
                <p className="text-gray-400 text-sm">
                  MP3, M4A, OGG, or WAV (Max 50MB)
                </p>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Advanced Options - Collapsible */}
      <details className="glass rounded-xl border border-white/10">
        <summary className="px-6 py-4 cursor-pointer text-gray-300 font-semibold hover:text-white transition-colors">
          ⚙️ Advanced Options
        </summary>
        <div className="px-6 pb-6">
          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder}
            onChange={(e) => handleInputChange('displayOrder', e.target.value)}
            placeholder="0"
            min="0"
          />
          <p className="text-gray-400 text-xs mt-2">
            💡 Lower numbers appear first (0 = default order)
          </p>
        </div>
      </details>

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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 border border-white/10 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Delete Practice Material?
              </h3>
              <p className="text-gray-300">
                This will permanently delete "<strong>{material.title}</strong>" and cannot be undone.
              </p>
            </div>
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
