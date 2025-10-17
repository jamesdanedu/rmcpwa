'use client'

import Input from '../../components/ui/Input'

export default function SetlistForm({ formData, onChange, error, onClearError }) {
  const handleChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }))
    if (error && onClearError) {
      onClearError()
    }
  }

  const handleEircodeClick = () => {
    if (formData.eircode && formData.eircode.trim()) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.eircode)}`
      window.open(mapsUrl, '_blank')
    }
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4">
        Setlist Information
      </h3>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-sm">⚠️</span>
            <span className="text-red-300 text-sm font-medium">
              {error}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Row 1: Name */}
        <Input
          label="Setlist Name"
          type="text"
          placeholder="e.g., Spring Concert 2025"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />

        {/* Row 2: Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Event Date"
            type="date"
            value={formData.eventDate}
            onChange={(e) => handleChange('eventDate', e.target.value)}
            min={today}
            required
          />

          <Input
            label="Event Time"
            type="time"
            value={formData.eventTime}
            onChange={(e) => handleChange('eventTime', e.target.value)}
          />
        </div>

        {/* Row 3: Eircode and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Input
              label="Eircode (Irish Postcode)"
              type="text"
              placeholder="e.g., D02 XY45"
              value={formData.eircode}
              onChange={(e) => handleChange('eircode', e.target.value.toUpperCase())}
              maxLength="8"
            />
            {formData.eircode && formData.eircode.trim() && (
              <button
                type="button"
                onClick={handleEircodeClick}
                className="absolute right-3 top-9 text-blue-400 hover:text-blue-300 transition-colors"
                title="Open in Google Maps"
              >
                📍
              </button>
            )}
          </div>

          <Input
            label="Target Duration (minutes)"
            type="number"
            placeholder="e.g., 45"
            value={formData.targetDuration}
            onChange={(e) => handleChange('targetDuration', e.target.value)}
            min="1"
            max="180"
          />
        </div>

        {/* Row 4: Venue Notes */}
        <Input
          label="Venue/Notes"
          as="textarea"
          placeholder="e.g., Roscommon Arts Centre - acoustic venue, no mics"
          value={formData.venueNotes}
          onChange={(e) => handleChange('venueNotes', e.target.value)}
          rows="3"
          className="resize-none"
        />
      </div>

      {/* Helper text */}
      {formData.eircode && formData.eircode.trim() && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span>💡</span>
            <span>Click the 📍 icon to view this location in Google Maps</span>
          </div>
        </div>
      )}
    </div>
  )
}
