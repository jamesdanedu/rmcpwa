'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createSetlist } from '../../lib/api'
import Button from '../../components/ui/Button'
import SetlistFormStep from './SetlistFormStep'
import SetlistSongsStep from './SetlistSongsStep'

export default function SetlistCreatorWizard({ onSetlistCreated, onCancel }) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    eventDate: '',
    eventTime: '',
    eircode: '',
    targetDuration: '',
    venueNotes: ''
  })
  const [selectedSongs, setSelectedSongs] = useState([])
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleFormNext = (data) => {
    // Validate Step 1
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

      const totalDuration = songs.reduce((sum, song) => sum + (song.duration_minutes || 0), 0)
      
      const setlistData = {
        name: formData.name.trim(),
        eventDate: formData.eventDate,
        eventTime: formData.eventTime || null,
        eircode: formData.eircode?.trim() || null,
        venueNotes: formData.venueNotes?.trim() || null,
        totalDuration: totalDuration
      }

      console.log('Creating setlist with data:', setlistData)
      console.log('Songs:', songs.length)

      const newSetlist = await createSetlist(setlistData, songs, user.id)
      
      console.log('Setlist created successfully:', newSetlist)
      
      onSetlistCreated(newSetlist)
      
    } catch (err) {
      console.error('Error creating setlist:', err)
      setError(err.message || 'Failed to create setlist')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${currentStep === 1 
              ? 'bg-gradient-to-r from-yellow-400 to-blue-500 text-white' 
              : 'bg-green-500 text-white'
            }
          `}>
            {currentStep > 1 ? '✓' : '1'}
          </div>
          <span className={`text-sm font-semibold ${currentStep === 1 ? 'text-white' : 'text-green-400'}`}>
            Event Details
          </span>
        </div>

        <div className={`h-0.5 w-12 ${currentStep > 1 ? 'bg-green-400' : 'bg-gray-600'}`} />

        <div className="flex items-center gap-2">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${currentStep === 2 
              ? 'bg-gradient-to-r from-yellow-400 to-blue-500 text-white' 
              : 'bg-gray-700 text-gray-400'
            }
          `}>
            2
          </div>
          <span className={`text-sm font-semibold ${currentStep === 2 ? 'text-white' : 'text-gray-400'}`}>
            Add Songs
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-sm">⚠️</span>
            <span className="text-red-300 text-sm font-medium">
              {error}
            </span>
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
        />
      )}
    </div>
  )
}
