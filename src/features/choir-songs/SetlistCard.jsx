'use client'

import { format, parseISO } from 'date-fns'

export default function SetlistCard({ setlist, status, onClick }) {
  const eventDate = parseISO(setlist.event_date)
  
  const handleEircodeClick = (e) => {
    e.stopPropagation() // Prevent card click when clicking eircode
    if (setlist.eircode) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(setlist.eircode)}`
      window.open(mapsUrl, '_blank')
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return null
    try {
      const [hours, minutes] = timeString.split(':')
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes))
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } catch {
      return timeString
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">
            Upcoming
          </span>
        )
      case 'past':
        return (
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-semibold">
            Past
          </span>
        )
      case 'archived':
        return (
          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full font-semibold">
            Archived
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div 
      onClick={onClick}
      className={`
        glass rounded-xl p-4 border border-white/10 cursor-pointer
        transition-all duration-200 hover:border-yellow-400/30 hover:bg-white/5
        hover:transform hover:scale-[1.01]
        ${status === 'archived' ? 'opacity-60' : ''}
      `}
    >
      {/* Header Row - Date and Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-yellow-400 font-bold text-lg">
            {format(eventDate, 'MMM d, yyyy')}
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center gap-2">
          {setlist.song_count && (
            <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full font-semibold">
              🎵 {setlist.song_count}
            </span>
          )}
        </div>
      </div>

      {/* Event Name */}
      <h4 className="text-white font-bold text-base mb-3 leading-tight">
        {setlist.name}
      </h4>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {/* Time */}
        {setlist.event_time && (
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-yellow-400">🕐</span>
            <span>{formatTime(setlist.event_time)}</span>
          </div>
        )}

        {/* Duration */}
        {setlist.total_duration_minutes && (
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-yellow-400">⏱️</span>
            <span>{setlist.total_duration_minutes} min</span>
          </div>
        )}

        {/* Eircode - Clickable */}
        {setlist.eircode && (
          <div className="flex items-center gap-2 col-span-2">
            <span className="text-yellow-400">📍</span>
            <button
              onClick={handleEircodeClick}
              className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
            >
              {setlist.eircode}
            </button>
            {setlist.venue_notes && (
              <span className="text-gray-400 text-xs truncate">
                • {setlist.venue_notes}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Click to view hint */}
      <div className="mt-3 pt-3 border-t border-white/10 text-center">
        <span className="text-xs text-gray-500">
          ▸ Click to view full details
        </span>
      </div>
    </div>
  )
}
