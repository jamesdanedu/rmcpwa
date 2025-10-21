'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getYouTubeThumbnail } from '../../lib/youtube-utils'
import VideoModal from './VideoModal'

export default function VotingCard({ vote, onVote, isVoting, error, onClearError }) {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  if (!vote?.songs) return null

  const song = vote.songs
  const thumbnailUrl = getYouTubeThumbnail(song.youtube_video_id, 'maxresdefault')

  const formatViewCount = (count) => {
    if (!count) return '0'
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1).replace('.0', '') + 'K'
    if (count < 1000000000) return (count / 1000000).toFixed(1).replace('.0', '') + 'M'
    return (count / 1000000000).toFixed(2).replace('.00', '').replace(/\.?0+$/, '') + 'B'
  }

  const handleImageClick = () => {
    if (onClearError) onClearError()
    setShowVideoModal(true)
  }

  const handleVote = (voteType) => {
    if (isVoting) return
    onVote(voteType)
  }

  return (
    <>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#F87171', fontSize: '14px' }}>⚠️</span>
              <span style={{ color: '#FCA5A5', fontSize: '14px', fontWeight: '500' }}>
                {error}
              </span>
              {onClearError && (
                <button
                  onClick={onClearError}
                  style={{
                    marginLeft: 'auto',
                    color: '#FCA5A5',
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'rgba(0, 0, 0, 0.2)',
          fontSize: '13px',
          color: '#9CA3AF'
        }}>
          <div>
            <strong style={{ color: '#FFD700' }}>3</strong> Songs to Vote
          </div>
          <div>
            <strong style={{ color: '#FFD700' }}>2</strong> Voted Today
          </div>
        </div>

        <div style={{ padding: '24px', textAlign: 'center' }}>
          {/* Song Thumbnail */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto 24px',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              background: '#1F2937'
            }}>
              {!imageError ? (
                <>
                  {imageLoading && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #374151',
                        borderTop: '3px solid #FFD700',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    </div>
                  )}
                  <Image
                    src={thumbnailUrl}
                    alt={`${song.title} by ${song.artist}`}
                    fill
                    style={{
                      objectFit: 'cover',
                      opacity: imageLoading ? 0 : 1,
                      transition: 'opacity 0.3s'
                    }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true)
                      setImageLoading(false)
                    }}
                    onClick={handleImageClick}
                  />
                </>
              ) : (
                <div 
                  onClick={handleImageClick}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6B7280',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎵</div>
                    <div style={{ fontSize: '14px' }}>Click to play video</div>
                  </div>
                </div>
              )}
              
              {/* Play Overlay */}
              {!imageError && (
                <div 
                  onClick={handleImageClick}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}>
                    <span style={{ fontSize: '32px', marginLeft: '4px' }}>▶️</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Song Info */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#374151 !important',
              marginBottom: '8px',
              lineHeight: '1.3'
            }}>
              {song.title}
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#374151 !important',
              marginBottom: '12px',
              fontWeight: '500'
            }}>
              {song.artist}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                👁️ {formatViewCount(song.youtube_view_count)} views
              </span>
            </div>
          </div>

          {/* Voting Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            width: '100%'
          }}>
            <button
              onClick={() => handleVote('up')}
              disabled={isVoting}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '24px 16px',
                border: 'none',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: isVoting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isVoting ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isVoting) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isVoting) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              <span style={{ fontSize: '36px' }}>{isVoting ? '⏳' : '👍'}</span>
              <span style={{ fontSize: '13px' }}>{isVoting ? 'VOTING...' : 'YES'}</span>
            </button>

            <button
              onClick={() => handleVote('down')}
              disabled={isVoting}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '24px 16px',
                border: 'none',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: isVoting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isVoting ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isVoting) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(239, 68, 68, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isVoting) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              <span style={{ fontSize: '36px' }}>{isVoting ? '⏳' : '👎'}</span>
              <span style={{ fontSize: '13px' }}>{isVoting ? 'VOTING...' : 'NO'}</span>
            </button>

            <button
              onClick={() => handleVote('skip')}
              disabled={isVoting}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '24px 16px',
                border: '2px solid rgba(156, 163, 175, 0.3)',
                borderRadius: '16px',
                background: 'rgba(156, 163, 175, 0.2)',
                color: '#9CA3AF',
                fontWeight: '700',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: isVoting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isVoting ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isVoting) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.background = 'rgba(156, 163, 175, 0.3)'
                  e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.5)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isVoting) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'rgba(156, 163, 175, 0.2)'
                  e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.3)'
                }
              }}
            >
              <span style={{ fontSize: '36px' }}>{isVoting ? '⏳' : '⏭️'}</span>
              <span style={{ fontSize: '13px' }}>{isVoting ? 'VOTING...' : 'SKIP'}</span>
            </button>
          </div>

          {/* Instructions */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#6B7280'
            }}>
              🎵 Click the image to preview • Vote if you'd like the choir to sing this song
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        song={song}
        onVote={onVote}
        isVoting={isVoting}
      />

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
