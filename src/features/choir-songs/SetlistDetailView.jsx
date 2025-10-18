'use client'

import { useAuth } from '../../hooks/useAuth'
import { isAfter } from 'date-fns'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function SetlistDetailView({ 
  isOpen, 
  onClose, 
  setlist, 
  onEdit,
  onGeneratePDF,
  isGeneratingPDF 
}) {
  const { user, isAuthenticated } = useAuth()

  if (!setlist) return null

  const eventDate = new Date(setlist.event_date)
  const isUpcoming = isAfter(eventDate, new Date())
  
  // Permission check: can edit if authenticated, not archived, and user created it
  const canEdit = isAuthenticated && 
                  !setlist.is_archived && 
                  setlist.created_by === user?.id

  // Format time if available
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

  const handleOpenMaps = () => {
    if (setlist.eircode) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(setlist.eircode)}`
      window.open(mapsUrl, '_blank')
    }
  }

  // Get genre color styling
  const getGenreColor = (genre) => {
    const colors = {
      'Christmas': 'bg-red-500/20 text-red-400',
      'Irish Folk': 'bg-green-500/20 text-green-400',
      'Gospel': 'bg-purple-500/20 text-purple-400',
      'Hymn': 'bg-blue-500/20 text-blue-400',
      'Contemporary': 'bg-yellow-500/20 text-yellow-400',
      'Jazz Standard': 'bg-orange-500/20 text-orange-400',
      'Classical': 'bg-indigo-500/20 text-indigo-400',
      'Traditional': 'bg-emerald-500/20 text-emerald-400'
    }
    return colors[genre] || 'bg-gray-500/20 text-gray-400'
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
    >
      {/* Header */}
      <div className="gradient-roscommon px-6 py-5 text-center relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-white">
            {setlist.name}
          </h2>
          {isUpcoming && !setlist.is_archived && (
            <span className="text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded-full">
              Upcoming
            </span>
          )}
          {setlist.is_archived && (
            <span className="text-xs bg-gray-500/30 text-gray-200 px-2 py-1 rounded-full">
              Archived
            </span>
          )}
        </div>
        
        {/* Event Details */}
        <div className="flex items-center justify-center flex-wrap gap-4 text-sm text-white/90">
          <span>📅 {eventDate.toLocaleDateString()}</span>
          
          {setlist.event_time && (
            <span>🕐 {formatTime(setlist.event_time)}</span>
          )}
          
          {setlist.total_duration_minutes && (
            <span>⏱️ {setlist.total_duration_minutes} minutes</span>
          )}
          
          <span>🎵 {setlist.song_count || setlist.songs?.length || 0} songs</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Venue Information */}
        {(setlist.eircode || setlist.venue_notes) && (
          <div className="glass rounded-xl p-4 border border-white/10 space-y-3">
            <h3 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
              📍 Venue Information
            </h3>
            
            {setlist.eircode && (
              <button
                onClick={handleOpenMaps}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
              >
                <span className="font-mono">{setlist.eircode}</span>
                <span className="text-xs">→ Open in Maps</span>
              </button>
            )}
            
            {setlist.venue_notes && (
              <p className="text-sm text-gray-300">
                {setlist.venue_notes}
              </p>
            )}
          </div>
        )}

        {/* Song List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
            🎼 Setlist Order
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {setlist.songs && setlist.songs.length > 0 ? (
              setlist.songs.map((song, index) => (
                <div 
                  key={song.id || index}
                  className="glass rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
                >
                  {/* Song Header */}
                  <div className="flex items-start gap-3 mb-2">
                    {/* Position Number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm leading-tight mb-1">
                        {song.title}
                      </h4>
                      <p className="text-gray-400 text-xs mb-2">
                        {song.artist}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex items-center flex-wrap gap-2">
                        {song.genre && (
                          <span className={`text-xs font-medium px-2 py-1 rounded ${getGenreColor(song.genre)}`}>
                            {song.genre}
                          </span>
                        )}
                        
                        {song.duration_minutes && (
                          <span className="text-xs text-gray-500">
                            ⏱️ {song.duration_minutes} min
                          </span>
                        )}
                        
                        {song.performance_notes?.difficulty && (
                          <span className="text-xs text-gray-500">
                            ⭐ {song.performance_notes.difficulty}/5
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Notes */}
                  {song.performance_notes?.notes && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-xs text-gray-400 italic">
                        💡 {song.performance_notes.notes}
                      </p>
                    </div>
                  )}
                  
                  {/* Lyrics Preview */}
                  {song.lyrics && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {song.lyrics.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="glass rounded-lg p-8 border border-white/10 text-center">
                <div className="text-4xl mb-3">🎵</div>
                <p className="text-gray-400 text-sm">
                  No songs in this setlist
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          {canEdit && (
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => {
                onEdit(setlist)
                onClose()
              }}
            >
              ✏️ Edit Setlist
            </Button>
          )}
          
          <Button
            variant="primary"
            size="md"
            className={canEdit ? 'flex-1' : 'flex-1'}
            onClick={() => onGeneratePDF(setlist.id)}
            loading={isGeneratingPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : '📄 Download PDF'}
          </Button>
          
          <Button
            variant="secondary"
            size="md"
            className="flex-shrink-0"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        {/* PDF Info */}
        <div className="glass rounded-lg p-3 border border-blue-500/20 bg-blue-500/5">
          <p className="text-xs text-blue-300 text-center">
            💡 PDF includes all song lyrics for printing
          </p>
        </div>
      </div>
    </Modal>
  )
}
