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
    console.log('Card clicked, opening modal')
    console.log('Material:', material)
    console.log('Has audio:', hasAudio)
    console.log('Audio URL:', material.audio_url)
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

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={material.title}
        size="md"
      >
        {/* IMPORTANT: Using simple div structure to avoid overflow issues */}
        <div style={{ padding: '24px' }}>
          
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

          {/* Audio Player - FIRST so it's not clipped */}
          {hasAudio && (
            <div style={{
              background: 'rgba(74, 222, 128, 0.1)',
              border: '2px solid #4ade80',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h4 style={{
                color: '#4ade80',
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🎵 Audio Track
              </h4>
              
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                marginBottom: '12px'
              }}>
                Click the ▶️ play button below to listen:
              </p>

              {/* Native HTML5 Audio Player */}
              <audio 
                controls 
                preload="auto"
                controlsList="nodownload"
                style={{
                  width: '100%',
                  height: '54px',
                  marginBottom: '12px',
                  display: 'block',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px'
                }}
                src={material.audio_url}
                onError={(e) => {
                  console.error('❌ Audio playback error:', e)
                  console.error('Error code:', e.target.error?.code)
                  console.error('Error message:', e.target.error?.message)
                }}
                onLoadedMetadata={() => {
                  console.log('✅ Audio metadata loaded')
                }}
                onCanPlay={() => {
                  console.log('✅ Audio can play')
                }}
                onPlay={() => {
                  console.log('🎵 Audio started playing')
                }}
              >
                <source src={material.audio_url} type="audio/mp4" />
                <source src={material.audio_url} type="audio/x-m4a" />
                <source src={material.audio_url} type="audio/mpeg" />
                Your browser does not support audio playback.
              </audio>

              {/* Audio filename */}
              {material.audio_filename && (
                <p style={{
                  fontSize: '11px',
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
            onClick={() => setShowDetail(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}
