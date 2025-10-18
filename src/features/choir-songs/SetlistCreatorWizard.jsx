'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createSetlist, updateSetlist } from '../../lib/api'
import Button from '../../components/ui/Button'
import SetlistFormStep from './SetlistFormStep'
import SetlistSongsStep from './SetlistSongsStep'

export default function SetlistCreatorWizard({ 
  onSetlistCreated, 
  onCancel, 
  editingSetlist = null 
}) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Pre-fill form data if editing
  const [formData, setFormData] = useState(
    editingSetlist ? {
      name: editingSetlist.name || '',
      eventDate: editingSetlist.event_date || '',
      eventTime: editingSetlist.event_time || '',
      eircode: editingSetlist.eircode || '',
      targetDuration: editingSetlist.total_duration_minutes?.toString() || '',
      venueNotes: editingSetlist.venue_notes || ''
    } : {
      name: '',
      eventDate: '',
      eventTime: '',
      eircode: '',
      targetDuration: '',
      venueNotes: ''
    }
  )
  
  const [selectedSongs, setSelectedSongs] = useState(
    editingSetlist?.songs || []
  )
  
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const isEditMode = !!editingSetlist

  const handleFormNext = (data) => {
    if (!data.name.trim()) {
      setError('Setlist name is required')
      return
    }
    if (!data.eventDate) {
      setError('Event date is required')
      return
    }

    setFormData(data)
    setError(null)
    setCurrentStep(2)
  }

  const handleSongsBack = () => {
    setCurrentStep(1)
  }

  const handleSave = async (songs) => {
    if (songs.length === 0) {
      setError('Please add at least one song to the setlist')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const totalDuration = songs.reduce((sum, song) => {
        return sum + (song.duration_minutes || 0)
      }, 0)
      
      const setlistData = {
        name: formData.name.trim(),
        eventDate: formData.eventDate,
        eventTime: formData.eventTime || null,
        eircode: formData.eircode?.trim() || null,
        venueNotes: formData.venueNotes?.trim() || null,
        totalDuration: totalDuration
      }

      let result

      if (isEditMode) {
        result = await updateSetlist(editingSetlist.id, setlistData, songs)
        console.log('Setlist updated successfully:', result)
      } else {
        result = await createSetlist(setlistData, songs, user.id)
        console.log('Setlist created successfully:', result)
      }
      
      onSetlistCreated(result)
      
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} setlist:`, err)
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} setlist`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-8 px-4">
      {/* Centered Container with max width */}
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isEditMode ? '✏️ Edit Setlist' : '🎼 Create New Setlist'}
          </h2>
          <p className="text-gray-400">
            {isEditMode 
              ? 'Update your setlist details and song order'
              : 'Build your setlist by adding songs and organizing the performance order'
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${currentStep === 1 
                ? 'bg-gradient-to-r from-yellow-400 to-blue-500 text-white shadow-lg' 
                : 'bg-green-500 text-white'
              }
            `}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className={`font-semibold ${currentStep === 1 ? 'text-white' : 'text-green-400'}`}>
              Event Details
            </span>
          </div>

          <div className={`h-1 w-16 rounded ${currentStep > 1 ? 'bg-green-400' : 'bg-gray-600'}`} />

          <div className="flex items-center gap-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${currentStep === 2 
                ? 'bg-gradient-to-r from-yellow-400 to-blue-500 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-400'
              }
            `}>
              2
            </div>
            <span className={`font-semibold ${currentStep === 2 ? 'text-white' : 'text-gray-400'}`}>
              {isEditMode ? 'Update Songs' : 'Add Songs'}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <span className="text-red-300 font-medium">
                {error}
              </span>
            </div>
          </div>
        )}

        {/* Edit Mode Info Banner */}
        {isEditMode && currentStep === 1 && (
          <div className="glass rounded-xl p-4 border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center gap-3">
              <span className="text-blue-400 text-2xl">ℹ️</span>
              <div className="flex-1">
                <p className="text-blue-300 font-medium">
                  Editing: {editingSetlist.name}
                </p>
                <p className="text-blue-400 text-sm mt-1">
                  You can update event details and modify the song list
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 1 && (
          <SetlistFormStep
            formData={formData}
            onNext={handleFormNext}
            onCancel={onCancel}
            error={error}
            onClearError={() => setError(null)}
            isEditMode={isEditMode}
          />
        )}

        {currentStep === 2 && (
          <SetlistSongsStep
            formData={formData}
            selectedSongs={selectedSongs}
            onSongsChange={setSelectedSongs}
            onBack={handleSongsBack}
            onSave={handleSave}
            isSaving={isSaving}
            error={error}
            onClearError={() => setError(null)}
            isEditMode={isEditMode}
          />
        )}
      </div>
    </div>
  )
}
