'use client'

import Input from '../../ui/Input'

export default function SetlistForm({ formData, onChange, error, onClearError }) {
  const handleChange = (field, value) => {
    onChange(prev => ({ ...prev, [field]: value }))
    if (error && onClearError) {
      onClearError()
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Setlist Name"
          type="text"
          placeholder="e.g., Spring Concert 2025"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />

        <Input
          label="Event Date"
          type="date"
          value={formData.eventDate}
          onChange={(e) => handleChange('eventDate', e.target.value)}
          min={today}
          required
        />

        <Input
          label="Target Duration (minutes)"
          type="number"
          placeholder="e.g., 45"
          value={formData.targetDuration}
          onChange={(e) => handleChange('targetDuration', e.target.value)}
          min="1"
          max="180"
        />

        <div className="md:col-span-1">
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
      </div>
    </div>
  )
}
