'use client'

import { useState } from 'react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function SetlistFormStep({ 
  formData, 
  onNext, 
  onCancel, 
  isEditMode = false 
}) {
  const [localData, setLocalData] = useState(formData)

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }))
  }

  const handleEircodeClick = () => {
    if (localData.eircode && localData.eircode.trim()) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localData.eircode)}`
      window.open(mapsUrl, '_blank')
    }
  }

  const handleNext = () => {
    onNext(localData)
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Form Container with enhanced styling */}
      <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl">
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <span className="text-3xl">📋</span>
          <div>
            <h3 className="text-xl font-bold text-white">
              Event Information
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Fill in the details for your performance
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <Input
              label="Setlist Name"
              type="text"
              placeholder="e.g., Spring Concert 2025"
              value={localData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* Section 2: Date & Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
              <span className="text-lg">🗓️</span>
              <span>Schedule</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Event Date"
                type="date"
                value={localData.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
                min={today}
                required
              />
              <Input
                label="Event Time"
                type="time"
                value={localData.eventTime}
                onChange={(e) => handleChange('eventTime', e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Location & Duration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
              <span className="text-lg">📍</span>
              <span>Location & Duration</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Eircode (Irish Postcode)"
                  type="text"
                  placeholder="e.g., D02 XY45"
                  value={localData.eircode}
                  onChange={(e) => handleChange('eircode', e.target.value.toUpperCase())}
                  maxLength="8"
                />
                {localData.eircode && localData.eircode.trim() && (
                  <button
                    type="button"
                    onClick={handleEircodeClick}
                    className="absolute right-4 top-[42px] text-blue-400 hover:text-blue-300 transition-colors text-xl"
                    title="Open in Google Maps"
                  >
                    🗺️
                  </button>
                )}
              </div>

              <Input
                label="Target Duration (minutes)"
                type="number"
                placeholder="e.g., 45"
                value={localData.targetDuration}
                onChange={(e) => handleChange('targetDuration', e.target.value)}
                min="1"
              />
            </div>
          </div>

          {/* Section 4: Additional Notes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
              <span className="text-lg">📝</span>
              <span>Venue Notes</span>
            </div>
            <Input
              label="Venue/Notes"
              as="textarea"
              rows="3"
              placeholder="e.g., Roscommon Arts Centre - acoustic venue, no mics"
              value={localData.venueNotes}
              onChange={(e) => handleChange('venueNotes', e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons - Enhanced styling */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 order-2 sm:order-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1 order-1 sm:order-2 shadow-lg shadow-yellow-500/20"
          onClick={handleNext}
        >
          Next: Add Songs →
        </Button>
      </div>
    </div>
  )
}
