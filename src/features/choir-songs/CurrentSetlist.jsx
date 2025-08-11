'use client'

import { useState } from 'react'

export default function CurrentSetlist({ setlist, onRemove, onReorder }) {
  const [draggedItem, setDraggedItem] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedItem !== null && draggedItem !== dropIndex) {
      onReorder(draggedItem, dropIndex)
    }
    
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  if (setlist.length === 0) {
    return (
      <div className="glass rounded-xl p-8 border border-white/10 text-center">
        <div className="text-gray-400 text-2xl mb-3">🎵</div>
        <h4 className="text-gray-300 font-semibold mb-2">
          No Songs Added
        </h4>
        <p className="text-gray-400 text-sm">
          Add songs from the available list to build your setlist.
          Drag and drop to reorder.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto glass rounded-xl p-4 border border-white/10">
      {setlist.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            glass rounded-lg p-3 border border-white/10 cursor-move
            transition-all duration-200 hover:border-yellow-400/30 hover:bg-white/5
            ${draggedItem === index ? 'opacity-50 scale-95' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div className="text-gray-400 text-sm font-mono cursor-grab active:cursor-grabbing">
              ⋮⋮
            </div>

            {/* Position */}
            <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold 
                            flex items-center justify-center flex-shrink-0">
              {item.position}
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-medium text-sm leading-tight mb-1">
                {item.song.title}
              </h5>
              
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{item.song.artist}</span>
                
                {item.song.duration_minutes && (
                  <>
                    <span>•</span>
                    <span>{item.song.duration_minutes} min</span>
                  </>
                )}
                
                <span>•</span>
                <span className="text-yellow-400">{item.song.genre}</span>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(item.id)}
              className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 
                         hover:text-white flex items-center justify-center text-xs font-bold
                         transition-colors duration-200 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
