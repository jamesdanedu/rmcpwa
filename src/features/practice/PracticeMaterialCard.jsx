'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Button from '../../components/ui/Button'

export default function PracticeMaterialCard({ material, isEditor, onEdit, onClick }) {
  const [showDetail, setShowDetail] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const hasText = Boolean(material.text_content)
  const hasAudio = Boolean(material.audio_url)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showDetail) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showDetail])

  const handleCardClick = () => {
    setShowDetail(true)
    if (onClick) onClick(material)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    onEdit()
  }

  const handleCloseModal = () => {
    setShowDetail(false)
  }

  // Custom Modal Component
  const customModal = showDetail ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleCloseModal}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10000,
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #4169E1 100%)',
          padding: '20px',
          borderTopLeftRadius: '18px',
          borderTopRightRadius: '18px',
          position: 'relative'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: 0,
            paddingRight: '40px'
          }}>
            {material.title}
          </h2>
          
          {/* Close button */}
          <button
            onClick={handleCloseModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          
          {/* Description */}
          {material.description && (
            <div style={{
              color: '#d1d5db',
              fontSize: '15px',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              {material.description}
            </div>
          )}

          {/* Audio Player */}
          {hasAudio && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%)',
              border: '2px solid #4ade80',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 0 20px rgba(74, 222, 128, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '24px' }}>🎵</span>
                <h4 style={{
                  color: '#4ade80',
                  fontWeight: '700',
                  fontSize: '18px',
                  margin: 0
                }}>
                  Audio Track
                </h4>
              </div>

              {/* Audio Player */}
              <audio 
                controls 
                preload="auto"
                style={{
                  width: '100%',
                  height: '54px',
                  marginBottom: '12px',
                  display: 'block',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '12px',
                  border: '2px solid rgba(74, 222, 128, 0.3)',
                  outline: 'none'
                }}
                src={material.audio_url}
              >
                <source src={material.audio_url} type="audio/mp4" />
                <source src={material.audio_url} type="audio/x-m4a" />
                <source src={material.audio_url} type="audio/mpeg" />
                Your browser does not support audio playback.
              </audio>

              {/* Audio filename */}
              {material.audio_filename && (
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  textAlign: 'center',
                  margin: 0,
                  wordBreak: 'break-all'
                }}>
                  📎 {material.audio_filename}
                </p>
              )}
            </div>
          )}

          {/* Text Content */}
          {hasText && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '24px'
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
                maxHeight: '300px',
                overflowY: 'auto',
                fontFamily: 'ui-monospace, monospace'
              }}>
                {material.text_content}
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
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body
  ) : null

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
              color: 'black', 
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

      {/* Custom Modal */}
      {customModal}
    </>
  )
}
