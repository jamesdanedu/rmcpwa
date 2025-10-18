'use client'

import { useState } from 'react'
import { formatDistanceToNow, isAfter, subDays } from 'date-fns'
import { getSetlistById } from '../../lib/api'
import { exportSetlistToPDF } from '../../lib/pdf-export'
import SetlistDetailView from './SetlistDetailView'

export default function SetlistsList({ setlists, onEdit }) {
  const [selectedSetlist, setSelectedSetlist] = useState(null)
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(null)

  if (setlists.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/10 text-center">
        <div className="text-4xl mb-4">🎼</div>
        <h3 className="text-xl font-bold text-white mb-3">
          No Setlists Yet
        </h3>
        <p className="text-gray-400 mb-6">
          Create your first setlist to organize songs for performances and gigs.
        </p>
        
        <div className="glass rounded-xl p-4 border border-white/5">
          <h4 className="text-yellow-400 font-semibold mb-2">
            Setlist Features
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p>• Organize songs by performance order</p>
            <p>• Track total duration for time limits</p>
            <p>• Filter songs by genre for themed events</p>
            <p>• Generate PDF setlists for printing</p>
            <p>• Auto-archive old setlists after 30 days</p>
          </div>
        </div>
      </div>
    )
  }

  // Separate active and archived setlists
  const now = new Date()
  const archiveDate = subDays(now, 30)
  
  const activeSetlists = setlists.filter(setlist => 
    !setlist.is_archived && isAfter(new Date(setlist.event_date), archiveDate)
  )
  
  const archivedSetlists = setlists.filter(setlist => 
    setlist.is_archived || !isAfter(new Date(setlist.event_date), archiveDate)
  )

  // Handle viewing setlist details
  const handleViewSetlist = async (setlistId) => {
    try {
      setIsLoadingDetail(true)
      const fullSetlist = await getSetlistById(setlistId)
      setSelectedSetlist(fullSetlist)
      setIsDetailViewOpen(true)
    } catch (err) {
      console.error('Error loading setlist details:', err)
      alert('Failed to load setlist details')
    } finally {
      setIsLoadingDetail(false)
    }
  }

  // Handle PDF generation
  const handleGeneratePDF = async (setlistId) => {
    try {
      setIsGeneratingPDF(setlistId)
      const fullSetlist = await getSetlistById(setlistId)
      await exportSetlistToPDF(fullSetlist)
    } catch (err) {
      console.error('Error generating PDF:', err)
      alert('Failed to generate PDF')
    } finally {
      setIsGeneratingPDF(null)
    }
  }

  // Handle edit from detail view
  const handleEdit = (setlist) => {
    if (onEdit) {
      onEdit(setlist)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Active Setlists */}
        {activeSetlists.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">
              Active Setlists
            </h3>
            {activeSetlists.map((setlist) => (
              <SetlistCard 
                key={setlist.id} 
                setlist={setlist}
                onView={handleViewSetlist}
                onGeneratePDF={handleGeneratePDF}
                isGeneratingPDF={isGeneratingPDF === setlist.id}
                isLoadingDetail={isLoadingDetail}
              />
            ))}
          </div>
        )}

        {/* Archived Setlists */}
        {archivedSetlists.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-400 flex items-center gap-2">
              📦 Archived Setlists
              <span className="text-xs font-normal text-gray-500">
                (Auto-archived 30+ days post-event)
              </span>
            </h3>
            {archivedSetlists.map((setlist) => (
              <SetlistCard 
                key={setlist.id} 
                setlist={setlist} 
                archived
                onView={handleViewSetlist}
                onGeneratePDF={handleGeneratePDF}
                isGeneratingPDF={isGeneratingPDF === setlist.id}
                isLoadingDetail={isLoadingDetail}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      <SetlistDetailView
        isOpen={isDetailViewOpen}
        onClose={() => {
          setIsDetailViewOpen(false)
          setSelectedSetlist(null)
        }}
        setlist={selectedSetlist}
        onEdit={handleEdit}
        onGeneratePDF={handleGeneratePDF}
        isGeneratingPDF={isGeneratingPDF === selectedSetlist?.id}
      />
    </>
  )
}

function SetlistCard({ setlist, archived = false, onView, onGeneratePDF, isGeneratingPDF, isLoadingDetail }) {
  const handleOpenMaps = (e) => {
    e.stopPropagation() // Prevent card click
    if (setlist.eircode) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(setlist.eircode)}`
      window.open(mapsUrl, '_blank')
    }
  }

  const handlePDFClick = (e) => {
    e.stopPropagation() // Prevent card click
    onGeneratePDF(setlist.id)
  }

  const handleCardClick = () => {
    onView(setlist.id)
  }

  const eventDate = new Date(setlist.event_date)
  const isUpcoming = isAfter(eventDate, new Date())
  
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

  return (
    <div 
      onClick={handleCardClick}
      className={`
        glass rounded-xl p-4 border border-white/10 transition-all duration-200 cursor-pointer
        ${archived 
          ? 'opacity-60' 
          : 'hover:border-yellow-400/30 hover:bg-white/5 hover:shadow-lg hover:scale-[1.01]'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-white font-semibold text-sm leading-tight">
              {setlist.name}
            </h4>
            {isUpcoming && !archived && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Upcoming
              </span>
            )}
            {archived && (
              <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">
                Archived
              </span>
            )}
          </div>
          
          <div className="flex items-center flex-wrap gap-4 text-xs text-gray-400 mb-3">
            <span>📅 {eventDate.toLocaleDateString()}</span>
            
            {setlist.event_time && (
              <span>🕐 {formatTime(setlist.event_time)}</span>
            )}
            
            {setlist.total_duration_minutes && (
              <span>⏱️ {setlist.total_duration_minutes} minutes</span>
            )}
            
            {setlist.song_count && (
              <span>🎵 {setlist.song_count} songs</span>
            )}
          </div>

          {setlist.eircode && (
            <button
              onClick={handleOpenMaps}
              className="text-xs text-blue-400 hover:text-blue-300 mb-3 flex items-center gap-1 transition-colors"
            >
              📍 {setlist.eircode} - View in Maps
            </button>
          )}

          {setlist.venue_notes && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
              {setlist.venue_notes}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-white/10">
        <button
          onClick={handleCardClick}
          className="text-xs px-3 py-2 glass rounded-lg text-gray-300 hover:bg-white/10 transition-colors flex-1"
        >
          👁️ View Details
        </button>
        
        <button
          onClick={handlePDFClick}
          disabled={isGeneratingPDF || isLoadingDetail}
          className="text-xs px-3 py-2 glass rounded-lg text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPDF ? '⏳' : '📄'} PDF
        </button>
      </div>
    </div>
  )
}
