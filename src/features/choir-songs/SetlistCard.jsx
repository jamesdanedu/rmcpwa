'use client'

import { format, parseISO } from 'date-fns'

export default function SetlistCard({ setlist, status, onClick }) {
  const eventDate = parseISO(setlist.event_date)
  
  const handleEircodeClick = (e) => {
    e.stopPropagation()
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

  const getStatusStyles = () => {
    switch (status) {
      case 'upcoming':
        return {
          dateColor: '#22C55E',
          badgeBg: 'rgba(34, 197, 94, 0.15)',
          badgeText: '#22C55E',
          badgeBorder: 'rgba(34, 197, 94, 0.3)',
          hoverBorder: 'rgba(34, 197, 94, 0.4)'
        }
      case 'past':
        return {
          dateColor: '#60A5FA',
          badgeBg: 'rgba(96, 165, 250, 0.15)',
          badgeText: '#60A5FA',
          badgeBorder: 'rgba(96, 165, 250, 0.3)',
          hoverBorder: 'rgba(96, 165, 250, 0.4)'
        }
      case 'archived':
        return {
          dateColor: '#9CA3AF',
          badgeBg: 'rgba(156, 163, 175, 0.15)',
          badgeText: '#9CA3AF',
          badgeBorder: 'rgba(156, 163, 175, 0.3)',
          hoverBorder: 'rgba(156, 163, 175, 0.4)'
        }
      default:
        return {
          dateColor: '#FFD700',
          badgeBg: 'rgba(255, 215, 0, 0.15)',
          badgeText: '#FFD700',
          badgeBorder: 'rgba(255, 215, 0, 0.3)',
          hoverBorder: 'rgba(255, 215, 0, 0.4)'
        }
    }
  }

  const styles = getStatusStyles()
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${isHovered ? styles.hoverBorder : 'rgba(255, 255, 255, 0.1)'}`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: status === 'archived' ? 0.7 : 1,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(255, 215, 0, 0.1)' : 'none'
      }}
    >
      {/* Header Row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Date */}
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '700',
            color: styles.dateColor,
            lineHeight: '1.2'
          }}>
            {format(eventDate, 'MMM d, yyyy')}
          </div>
          
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: '600',
            padding: '6px 12px',
            borderRadius: '999px',
            background: styles.badgeBg,
            color: styles.badgeText,
            border: `1px solid ${styles.badgeBorder}`,
            width: 'fit-content'
          }}>
            {status === 'upcoming' ? 'Upcoming' : status === 'past' ? 'Past' : 'Archived'}
          </div>
        </div>
        
        {/* Song Count Badge */}
        {setlist.song_count && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end',
            gap: '4px'
          }}>
            <div style={{ 
              fontSize: '11px',
              color: '#9CA3AF',
              fontWeight: '500'
            }}>
              Songs
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#000',
              padding: '6px 14px',
              borderRadius: '999px',
              fontWeight: '700',
              fontSize: '14px'
            }}>
              {setlist.song_count}
            </div>
          </div>
        )}
      </div>

      {/* Event Name */}
      <h4 style={{
        color: '#FFFFFF',
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '20px',
        lineHeight: '1.3'
      }}>
        {setlist.name}
      </h4>

      {/* Details Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Time */}
        {setlist.event_time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🕐
            </div>
            <span style={{ color: '#D1D5DB', fontWeight: '500', fontSize: '15px' }}>
              {formatTime(setlist.event_time)}
            </span>
          </div>
        )}

        {/* Duration */}
        {setlist.total_duration_minutes && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              ⏱️
            </div>
            <span style={{ color: '#D1D5DB', fontWeight: '500', fontSize: '15px' }}>
              {setlist.total_duration_minutes} minutes
            </span>
          </div>
        )}

        {/* Location */}
        {setlist.eircode && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0
            }}>
              📍
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <button
                onClick={handleEircodeClick}
                style={{
                  color: '#60A5FA',
                  fontWeight: '600',
                  fontSize: '15px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: isHovered ? 'underline' : 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#93C5FD'}
                onMouseLeave={(e) => e.target.style.color = '#60A5FA'}
              >
                {setlist.eircode}
              </button>
              {setlist.venue_notes && (
                <div style={{
                  color: '#9CA3AF',
                  fontSize: '13px',
                  marginTop: '4px',
                  lineHeight: '1.5'
                }}>
                  {setlist.venue_notes}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span style={{ color: '#FFD700', fontWeight: '700', fontSize: '14px' }}>▸</span>
        <span style={{ color: '#9CA3AF', fontSize: '13px', fontWeight: '500' }}>
          Click to view full details
        </span>
      </div>
    </div>
  )
}

// Add React import at the top if not already there
import React from 'react'
