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

  const getStatusConfig = () => {
    switch (status) {
      case 'upcoming':
        return {
          badge: 'Upcoming',
          badgeClass: 'bg-green-500/20 text-green-400 border-green-500/30',
          borderHover: 'hover:border-green-400/40',
          dateColor: 'text-green-400'
        }
      case 'past':
        return {
          badge: 'Past',
          badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          borderHover: 'hover:border-blue-400/40',
          dateColor: 'text-blue-400'
        }
      case 'archived':
        return {
          badge: 'Archived',
          badgeClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          borderHover: 'hover:border-gray-400/40',
          dateColor: 'text-gray-400'
        }
      default:
        return {
          badge: '',
          badgeClass: '',
          borderHover: 'hover:border-yellow-400/40',
          dateColor: 'text-yellow-400'
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div 
      onClick={onClick}
      className={`
        glass rounded-xl p-5 border border-white/10 cursor-pointer
        transition-all duration-300 ${statusConfig.borderHover}
        hover:bg-white/5 hover:shadow-lg hover:shadow-yellow-400/10
        ${status === 'archived' ? 'opacity-70' : ''}
      `}
    >
      {/* Header Row - Date and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          {/* Date - Large and prominent */}
          <div className={`font-bold text-2xl ${statusConfig.dateColor}`}>
            {format(eventDate, 'MMM d, yyyy')}
          </div>
          
          {/* Status Badge */}
          {statusConfig.badge && (
            <span className={`
              inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 
              rounded-full border ${statusConfig.badgeClass} w-fit
            `}>
              {statusConfig.badge}
            </span>
          )}
        </div>
        
        {/* Song Count Badge */}
        {setlist.song_count && (
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs text-gray-400 font-medium">Songs</div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black 
                          px-3 py-1 rounded-full font-bold text-sm">
              {setlist.song_count}
            </div>
          </div>
        )}
      </div>

      {/* Event Name */}
      <h4 className="text-white font-bold text-xl mb-4 leading-tight">
        {setlist.name}
      </h4>

      {/* Details Section */}
      <div className="space-y-2">
        {/* Time */}
        {setlist.event_time && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <span className="text-yellow-400 text-lg">🕐</span>
            </div>
            <span className="text-gray-300 font-medium">{formatTime(setlist.event_time)}</span>
          </div>
        )}

        {/* Duration */}
        {setlist.total_duration_minutes && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <span className="text-yellow-400 text-lg">⏱️</span>
            </div>
            <span className="text-gray-300 font-medium">
              {setlist.total_duration_minutes} minutes
            </span>
          </div>
        )}

        {/* Location - Eircode + Venue */}
        {setlist.eircode && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-400 text-lg">📍</span>
            </div>
            <div className="flex-1 min-w-0">
              <button
                onClick={handleEircodeClick}
                className="text-blue-400 hover:text-blue-300 font-semibold 
                         transition-colors hover:underline"
              >
                {setlist.eircode}
              </button>
              {setlist.venue_notes && (
                <div className="text-gray-400 text-sm mt-1 leading-relaxed">
                  {setlist.venue_notes}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Hint */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
        <span className="text-yellow-400 font-bold">▸</span>
        <span className="text-gray-400 text-sm font-medium">
          Click to view full details
        </span>
      </div>
    </div>
  )
}
