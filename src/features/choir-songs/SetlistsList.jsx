'use client'

import { useState } from 'react'
import { isAfter, subDays } from 'date-fns'
import { getSetlistById } from '../../lib/api'
import { exportSetlistToPDF } from '../../lib/pdf-export'
import SetlistDetailView from './SetlistDetailView'

export default function SetlistsList({ setlists, onEdit }) {
  const [selectedSetlist, setSelectedSetlist] = useState(null)
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(null)

  console.log('SetlistsList rendering with', setlists.length, 'setlists')

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
    console.log('Opening detail view for:', setlistId)
    try {
      setIsLoadingDetail(true)
      const fullSetlist = await getSetlistById(setlistId)
      console.log('Full setlist loaded:', fullSetlist)
      setSelectedSetlist(fullSetlist)
      setIsDetailViewOpen(true)
      console.log('Modal should now be open, isDetailViewOpen =', true)
    } catch (err) {
      console.error('Error loading setlist details:', err)
      alert('Failed to load setlist details')
    } finally {
      setIsLoadingDetail(false)
    }
  }

  // Handle PDF generation
  const handleGeneratePDF = async (setlistId, e) => {
    if (e) e.stopPropagation()
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

  const handleCloseModal = () => {
    console.log('Closing modal')
    setIsDetailViewOpen(false)
    setSelectedSetlist(null)
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Active Setlists */}
        {activeSetlists.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: 'white',
              margin: '0 0 4px 0'
            }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#9CA3AF',
              margin: '0 0 4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📦 Archived Setlists</span>
              <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>
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
      {selectedSetlist && (
        <SetlistDetailView
          isOpen={isDetailViewOpen}
          onClose={handleCloseModal}
          setlist={selectedSetlist}
          onEdit={handleEdit}
          onGeneratePDF={(id) => handleGeneratePDF(id, null)}
          isGeneratingPDF={isGeneratingPDF === selectedSetlist?.id}
        />
      )}
    </>
  )
}

function SetlistCard({ setlist, archived = false, onView, onGeneratePDF, isGeneratingPDF, isLoadingDetail }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleCardClick = () => {
    if (!isLoadingDetail) {
      console.log('Card clicked:', setlist.id)
      onView(setlist.id)
    }
  }

  const handlePDFClick = (e) => {
    e.stopPropagation()
    onGeneratePDF(setlist.id, e)
  }

  const handleOpenMaps = (e) => {
    e.stopPropagation()
    if (setlist.eircode) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(setlist.eircode)}`
      window.open(mapsUrl, '_blank')
    }
  }

  const eventDate = new Date(setlist.event_date)
  const isUpcoming = isAfter(eventDate, new Date())
  
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: isHovered && !archived ? '2px solid rgba(255, 215, 0, 0.3)' : '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        cursor: isLoadingDetail ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: archived ? 0.6 : (isLoadingDetail ? 0.5 : 1),
        transform: isHovered && !archived ? 'scale(1.01) translateY(-2px)' : 'scale(1)',
        boxShadow: isHovered && !archived ? '0 8px 32px rgba(255, 215, 0, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
        pointerEvents: isLoadingDetail ? 'none' : 'auto'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <h4 style={{ 
            color: 'black', 
            fontWeight: '600', 
            fontSize: '18px',
            margin: 0,
            lineHeight: '1.3'
          }}>
            {setlist.name}
          </h4>
          {isUpcoming && !archived && (
            <span style={{
              fontSize: '11px',
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#4ade80',
              padding: '4px 10px',
              borderRadius: '999px',
              fontWeight: '600'
            }}>
              Upcoming
            </span>
          )}
          {archived && (
            <span style={{
              fontSize: '11px',
              background: 'rgba(107, 114, 128, 0.2)',
              color: '#9ca3af',
              padding: '4px 10px',
              borderRadius: '999px',
              fontWeight: '600'
            }}>
              Archived
            </span>
          )}
        </div>
        
        {/* Metadata */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px',
          fontSize: '13px',
          color: '#9ca3af',
          marginBottom: '12px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            📅 {eventDate.toLocaleDateString()}
          </span>
          
          {setlist.event_time && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              🕐 {formatTime(setlist.event_time)}
            </span>
          )}
          
          {setlist.total_duration_minutes && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              ⏱️ {setlist.total_duration_minutes} min
            </span>
          )}
          
          {setlist.song_count && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              🎵 {setlist.song_count} songs
            </span>
          )}
        </div>

        {setlist.eircode && (
          <button
            onClick={handleOpenMaps}
            style={{
              fontSize: '12px',
              color: '#60a5fa',
              background: 'none',
              border: 'none',
              padding: '0',
              marginBottom: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#93c5fd'}
            onMouseOut={(e) => e.currentTarget.style.color = '#60a5fa'}
          >
            📍 {setlist.eircode} - View in Maps
          </button>
        )}

        {setlist.venue_notes && (
          <p style={{
            fontSize: '13px',
            color: '#9ca3af',
            margin: '0',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {setlist.venue_notes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        gap: '8px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={handleCardClick}
          disabled={isLoadingDetail}
          style={{
            flex: 1,
            fontSize: '13px',
            padding: '10px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: '#d1d5db',
            fontWeight: '600',
            cursor: isLoadingDetail ? 'wait' : 'pointer',
            transition: 'all 0.2s',
            opacity: isLoadingDetail ? 0.5 : 1
          }}
          onMouseOver={(e) => {
            if (!isLoadingDetail) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = 'white'
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.color = '#d1d5db'
          }}
        >
          {isLoadingDetail ? '⏳ Loading...' : '👁️ View Details'}
        </button>
        
        <button
          onClick={handlePDFClick}
          disabled={isGeneratingPDF || isLoadingDetail}
          style={{
            fontSize: '13px',
            padding: '10px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: '#d1d5db',
            fontWeight: '600',
            cursor: (isGeneratingPDF || isLoadingDetail) ? 'wait' : 'pointer',
            transition: 'all 0.2s',
            opacity: (isGeneratingPDF || isLoadingDetail) ? 0.5 : 1,
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => {
            if (!isGeneratingPDF && !isLoadingDetail) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = 'white'
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.color = '#d1d5db'
          }}
        >
          {isGeneratingPDF ? '⏳' : '📄 PDF'}
        </button>
      </div>
    </div>
  )
}
