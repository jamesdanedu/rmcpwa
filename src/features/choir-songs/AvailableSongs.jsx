'use client'

export default function AvailableSongs({ songs, onAddToSetlist, selectedGenre }) {
  // Enhanced debug logging
  console.log('=== AVAILABLE SONGS DEBUG ===')
  console.log('Total songs received:', songs?.length || 0)
  console.log('Songs array:', songs)
  if (songs && songs.length > 0) {
    console.log('First song object:', songs[0])
    console.log('First song title:', songs[0]?.title)
    console.log('First song artist:', songs[0]?.artist)
  }
  console.log('============================')
  
  const getGenreColor = (genre) => {
    const colors = {
      'Christmas': 'bg-red-100 text-red-700 border-red-200',
      'Irish Folk': 'bg-green-100 text-green-700 border-green-200',
      'Gospel': 'bg-purple-100 text-purple-700 border-purple-200',
      'Hymn': 'bg-blue-100 text-blue-700 border-blue-200',
      'Contemporary': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Jazz Standard': 'bg-amber-100 text-amber-700 border-amber-200',
      'Classical': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Traditional': 'bg-gray-100 text-gray-700 border-gray-200',
      'R&B, Soul': 'bg-pink-100 text-pink-700 border-pink-200',
      'Folk, Traditional Irish': 'bg-green-100 text-green-700 border-green-200',
      'Folk Rock, Art Pop': 'bg-purple-100 text-purple-700 border-purple-200',
      'Progressive Rock, Folk Rock': 'bg-blue-100 text-blue-700 border-blue-200',
      'Alternative Rock, Jangle Pop': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Roots Rock, Country Rock': 'bg-amber-100 text-amber-700 border-amber-200',
      'Celtic Folk Ballad, Celtic Rock, Folk Rock': 'bg-green-100 text-green-700 border-green-200',
      'Folk, Celtic Folk': 'bg-green-100 text-green-700 border-green-200',
      'New Wave, Pop Rock': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Alternative Rock, Indie Rock': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Pop, Pop Ballad': 'bg-pink-100 text-pink-700 border-pink-200',
      'Soft Rock, Pop Ballad': 'bg-blue-100 text-blue-700 border-blue-200',
      'Alternative Rock, Indie Pop': 'bg-purple-100 text-purple-700 border-purple-200',
      'Folk': 'bg-green-100 text-green-700 border-green-200',
      'Indie Dance, Alternative Rock': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    }
    return colors[genre] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  if (!songs || songs.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎵</div>
        <h4 style={{ color: '#1f2937', fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>
          {selectedGenre === 'all' ? 'All songs added' : `No ${selectedGenre} songs available`}
        </h4>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          {selectedGenre === 'all' 
            ? 'All available songs have been added to your setlist'
            : `Try selecting a different genre or add more ${selectedGenre} songs to the choir collection`
          }
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
      {songs.map((song) => (
        <div
          key={song.id}
          onClick={() => onAddToSetlist(song)}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FFD700'
            e.currentTarget.style.transform = 'translateX(4px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)'
            e.currentTarget.style.transform = 'translateX(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* TITLE - Dark and prominent */}
              <h5 style={{
                color: '#111827',
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '8px',
                lineHeight: '1.4',
                wordBreak: 'break-word'
              }}>
                {song.title || song.song_title || '[NO TITLE]'}
              </h5>
              
              {/* ARTIST AND GENRE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span style={{ color: '#4b5563', fontSize: '13px', fontWeight: '500' }}>
                  {song.artist || '[NO ARTIST]'}
                </span>
                <span style={{ color: '#d1d5db' }}>•</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getGenreColor(song.genre)}`}>
                  {song.genre || '[NO GENRE]'}
                </span>
              </div>
              
              {/* DURATION */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
                {song.duration_minutes && (
                  <span style={{ fontWeight: '500' }}>⏱️ {song.duration_minutes} min</span>
                )}
                
                {song.performance_notes?.difficulty && (
                  <span style={{ fontWeight: '500' }}>⭐ {song.performance_notes.difficulty}/5</span>
                )}
              </div>
            </div>

            {/* Add Button */}
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '3px solid #10b981',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                background: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#10b981'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.color = '#10b981'
                e.currentTarget.style.transform = 'scale(1)'
              }}
              >
                +
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
