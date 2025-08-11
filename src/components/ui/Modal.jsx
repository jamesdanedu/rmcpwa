'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative w-full ${sizes[size]} max-h-[90vh] overflow-hidden
        glass rounded-2xl border border-white/10 shadow-2xl
        animate-in fade-in zoom-in-95 duration-200
      `}>
        {/* Header */}
        {title && (
          <div className="gradient-roscommon px-6 py-4 text-center">
            <h2 className="text-lg font-bold text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full glass hover:bg-white/20 
                         flex items-center justify-center text-white transition-colors"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
        
        {/* Close button if no title */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full glass hover:bg-white/20 
                       flex items-center justify-center text-white transition-colors z-10"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
