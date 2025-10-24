'use client'

import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

export default function PracticeMaterialCard({ material, isEditor, onEdit, onClick }) {
  const [showDetail, setShowDetail] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const hasText = Boolean(material.text_content)
  const hasAudio = Boolean(material.audio_url)

  const handleCardClick = () => {
    setShowDetail(true)
    if (onClick) onClick(material)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    onEdit()
  }

  return (
    <>
      <div 
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: isHovered ? '2px solid rgba(255, 215, 0, 0.3)' : '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: isHovered ? 'scale(1.01) translateY(-2px)' : 'scale(1)',
          boxShadow: isHovered ? '0 8px 32px rgba(255, 215, 0, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <h4 style={{ 
              color: 'white', 
              fontWeight: '600', 
              fontSize: '18px',
              margin: '0 0 8px 0',
              lineHeight: '1.3'
            }}>
              {material.title}
            </h4>
            
            {/* Description */}
            {material.description && (
              <p style={{
                color: '#9ca3af',
                fontSize: '14px',
                margin: '0 0 12px 0',
                lineHeight: '1.5'
              }}>
                {material.description}
              </p>
            )}

            {/* Content indicators */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '13px'
            }}>
              {hasText && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#60a5fa',
                  fontWeight: '500'
                }}>
                  📄 Text
                </span>
              )}
              {hasAudio && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#4ade80',
                  fontWeight: '500'
                }}>
                  🎵 Audio
                </span>
              )}
              {!hasText && !hasAudio && (
                <span style={{ color: '#6b7280', fontSize: '12px' }}>
                  No content
                </span>
              )}
            </div>
          </div>

          {/* Edit button for editors */}
          {isEditor && (
            <button
              onClick={handleEditClick}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
              }}
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={material.title}
        size="md"
      >
        <div className="p-6 space-y-6">
          {/* Description */}
          {material.description && (
            <div style={{
              color: '#d1d5db',
              fontSize: '15px',
              lineHeight: '1.6'
            }}>
              {material.description}
            </div>
          )}

          {/* Text Content */}
          {hasText && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h4 style={{
                color: '#fbbf24',
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📄 Lyrics / Notes
              </h4>
              <div style={{
                color: 'white',
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                lineHeight: '1.7',
                maxHeight: '400px',
                overflowY: 'auto',
                fontFamily: 'ui-monospace, monospace'
              }}>
                {material.text_content}
              </div>
            </div>
          )}

          {/* Audio Player */}
          {hasAudio && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h4 style={{
                color: '#4ade80',
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🎵 Audio Track
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Native HTML5 Audio Player */}
                <audio 
                  controls 
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '8px'
                  }}
                >
                  <source src={material.audio_url} type="audio/mpeg" />
                  <source src={material.audio_url} type="audio/mp4" />
                  <source src={material.audio_url} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>

                {/* Audio filename */}
                {material.audio_filename && (
                  <p style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    textAlign: 'center',
                    margin: 0
                  }}>
                    {material.audio_filename}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!hasText && !hasAudio && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <p style={{ color: '#9ca3af' }}>
                No content available for this practice material
              </p>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setShowDetail(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}
