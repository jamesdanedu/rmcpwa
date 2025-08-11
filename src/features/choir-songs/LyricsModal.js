'use client'

import Modal from '../../ui/Modal'

export default function LyricsModal({ isOpen, onClose, song }) {
  if (!song) return null

  const renderLyricsStructure = (structure) => {
    if (!structure || !Array.isArray(structure)) {
      return (
        <div className="text-center text-gray-400 py-8">
          <div className="text-2xl mb-2">📝</div>
          <p>No structured lyrics available</p>
        </div>
      )
    }

    let chorusContent = ''

    return structure.map((section, index) => {
      switch (section.type) {
        case 'verse':
          return (
            <div key={index} className="lyrics-section verse-section mb-8">
              <div className="section-label text-yellow-400 font-bold text-sm uppercase tracking-wide mb-3">
                Verse {section.number}
              </div>
              <div className="section-content space-y-1">
                {section.content.map((line, lineIndex) => (
                  <div key={lineIndex} className="lyrics-line text-white text-base leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
              {section.notes && (
                <div className="section-notes text-xs text-gray-400 italic mt-3 p-2 bg-gray-800/30 rounded">
                  {section.notes}
                </div>
              )}
            </div>
          )

        case 'chorus':
          // Store chorus content for repeats
          chorusContent = section.content
          return (
            <div key={index} className="lyrics-section chorus-section mb-8 
                            bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
              <div className="section-label text-yellow-400 font-bold text-sm uppercase tracking-wide mb-3">
                Chorus
              </div>
              <div className="section-content space-y-1">
                {section.content.map((line, lineIndex) => (
                  <div key={lineIndex} className="lyrics-line text-yellow-300 text-base leading-relaxed font-medium">
                    {line}
                  </div>
                ))}
              </div>
              {section.repeat && (
                <div className="repeat-indicator text-yellow-400 text-xs font-semibold mt-3 text-center">
                  🔄 Repeat after each verse
                </div>
              )}
              {section.emphasis && (
                <div className="section-notes text-xs text-yellow-400 italic mt-3 p-2 bg-yellow-400/10 rounded">
                  Emphasis: {section.emphasis}
                </div>
              )}
            </div>
          )

        case 'chorus_repeat':
          return (
            <div key={index} className="lyrics-section chorus-repeat-section mb-8
                            bg-yellow-400/5 border-2 border-dashed border-yellow-400/30 rounded-xl p-4">
              <div className="section-label text-yellow-400 font-bold text-sm uppercase tracking-wide mb-3">
                Chorus (Repeat)
              </div>
              <div className="section-content space-y-1 opacity-70">
                {chorusContent && chorusContent.map((line, lineIndex) => (
                  <div key={lineIndex} className="lyrics-line text-yellow-300 text-base leading-relaxed font-medium italic">
                    {line}
                  </div>
                ))}
              </div>
              <div className="repeat-indicator text-yellow-400 text-xs font-semibold mt-3 text-center">
                🔄 As above
              </div>
            </div>
          )

        case 'bridge':
          return (
            <div key={index} className="lyrics-section bridge-section mb-8
                            bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <div className="section-label text-blue-400 font-bold text-sm uppercase tracking-wide mb-3">
                Bridge
              </div>
              <div className="section-content space-y-1">
                {section.content.map((line, lineIndex) => (
                  <div key={lineIndex} className="lyrics-line text-white text-base leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
              {section.notes && (
                <div className="section-notes text-xs text-blue-400 italic mt-3 p-2 bg-blue-500/10 rounded">
                  {section.notes}
                </div>
              )}
            </div>
          )

        case 'outro':
          return (
            <div key={index} className="lyrics-section outro-section mb-8
                            bg-gray-500/5 border border-gray-500/20 rounded-xl p-4">
              <div className="section-label text-gray-400 font-bold text-sm uppercase tracking-wide mb-3">
                Outro
              </div>
              <div className="section-content space-y-1">
                {section.content.map((line, lineIndex) => (
                  <div key={lineIndex} className="lyrics-line text-white text-base leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
              {section.notes && (
                <div className="section-notes text-xs text-gray-400 italic mt-3 p-2 bg-gray-500/10 rounded">
                  {section.notes}
                </div>
              )}
            </div>
          )

        default:
          return null
      }
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="gradient-roscommon p-6 text-center text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold mb-2">{song.title}</h2>
          <p className="text-sm opacity-90 mb-4">{song.artist}</p>
          
          {/* Metadata */}
          {song.performance_notes && (
            <div className="flex justify-center gap-4 flex-wrap text-xs">
              {song.performance_notes.key && (
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🎵 {song.performance_notes.key}
                </span>
              )}
              {song.performance_notes.tempo && (
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  ⏱️ {song.performance_notes.tempo}
                </span>
              )}
              {song.performance_notes.difficulty && (
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  ⭐ Difficulty {song.performance_notes.difficulty}/5
                </span>
              )}
            </div>
          )}
        </div>

        {/* Lyrics Content */}
        <div className="p-6">
          {song.lyrics?.structure ? (
            renderLyricsStructure(song.lyrics.structure)
          ) : (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg font-semibold mb-2">No Lyrics Available</p>
              <p className="text-sm">Lyrics haven't been added for this song yet.</p>
            </div>
          )}
        </div>

        {/* Performance Notes */}
        {song.performance_notes?.special_notes && (
          <div className="glass border-t border-white/10 p-6">
            <h4 className="text-yellow-400 font-bold mb-3">Performance Notes</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {song.performance_notes.special_notes}
            </p>
            
            {song.performance_notes.accompaniment && (
              <div className="mt-4">
                <h5 className="text-yellow-400 font-semibold text-sm mb-1">Accompaniment</h5>
                <p className="text-gray-400 text-xs">
                  {song.performance_notes.accompaniment}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
