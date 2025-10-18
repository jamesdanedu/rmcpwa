'use client'

import { useState } from 'react'

export default function CurrentSetlist({ setlist, onRemove, onReorder }) {
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
    // Add visual feedback
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedItem !== null && draggedItem !== dropIndex) {
      onReorder(draggedItem, dropIndex)
    }
    
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  if (setlist.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '2px dashed rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        padding: '48px 32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎵</div>
        <h4 style={{ color: '#1f2937', fontWeight: '600', marginBottom: '8px', fontSize: '18px' }}>
          No Songs Added
        </h4>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
          Add songs from the available list to build your setlist.
          <br />
          <strong>Drag and drop</strong> to reorder songs.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxHeight: '600px',
      overflowY: 'auto',
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(0, 0, 0, 0.08)',
      borderRadius: '16px',
      padding: '16px'
    }}>
      {setlist.map((item, index) => {
        const song = item.song || item
        const isDragging = draggedItem === index
        const isDropTarget = dragOverIndex === index && draggedItem !== index
        
        return (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              background: isDragging 
                ? 'rgba(255, 215, 0, 0.2)' 
                : isDropTarget 
                  ? 'rgba(65, 105, 225, 0.15)' 
                  : 'rgba(255, 255, 255, 0.95)',
              border: isDragging 
                ? '3px dashed #FFD700' 
                : isDropTarget 
                  ? '3px solid #4169E1' 
                  : '2px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'grab',
              transition: 'all 0.2s ease',
              position: 'relative',
              transform: isDropTarget ? 'scale(1.02)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!isDragging && !isDropTarget) {
                e.currentTarget.style.borderColor = '#FFD700'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isDragging && !isDropTarget) {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {/* Drag indicator */}
            <div style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '20px',
              cursor: 'grab',
              userSelect: 'none'
            }}>
              ⋮⋮
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '24px' }}>
              {/* Position Badge */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD700, #4169E1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}>
                {index + 1}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* TITLE - Dark and prominent */}
                <h5 style={{
                  color: '#111827',
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '6px',
                  lineHeight: '1.4',
                  wordBreak: 'break-word'
                }}>
                  {song.title || song.song_title || '[NO TITLE]'}
                </h5>
                
                {/* ARTIST */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#4b5563', fontSize: '13px', fontWeight: '500' }}>
                    {song.artist || '[NO ARTIST]'}
                  </span>
                  {song.duration_minutes && (
                    <>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>
                        ⏱️ {song.duration_minutes} min
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(item.id)
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid #ef4444',
                  background: 'white',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#ef4444'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ×
              </button>
            </div>

            {/* Drop indicator */}
            {isDropTarget && (
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '20%',
                right: '20%',
                height: '4px',
                background: '#4169E1',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(65, 105, 225, 0.5)'
              }} />
            )}
          </div>
        )
      })}
      
      {/* Instruction footer */}
      <div style={{
        marginTop: '8px',
        padding: '12px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#1e40af', 
          fontSize: '12px', 
          margin: 0,
          fontWeight: '600'
        }}>
          💡 Drag songs to reorder • Click × to remove
        </p>
      </div>
    </div>
  )
}
