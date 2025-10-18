'use client'

export default function AvailableSongs({ songs, onAddToSetlist, selectedGenre }) {
  // Enhanced debug logging
  console.log('=== AVAILABLE SONGS DEBUG ===')
  console.log('Total songs received:', songs?.length || 0)
  console.log('Songs array:', songs)
  if (songs && songs.length > 0) {
    console.log('First song object:', songs[0])
    console.log('First song keys:', Object.keys(songs[0]))
    console.log('First song title:', songs[0]?.title)
    console.log('First song artist:', songs[0]?.artist)
  }
  console.log('============================')
  
  const getGenreColor = (genre) => {
    const colors = {
      'Christmas': 'text-red-400 bg-red-400/20',
      'Irish Folk': 'text-green-400 bg-green-400/20',
      'Gospel': 'text-purple-400 bg-purple-400/20',
      'Hymn': 'text-blue-400 bg-blue-400/20',
      'Contemporary': 'text-cyan-400 bg-cyan-400/20',
      'Jazz Standard': 'text-amber-400 bg-amber-400/20',
      'Classical': 'text-indigo-400 bg-indigo-400/20',
      'Traditional': 'text-gray-400 bg-gray-400/20',
      'R&B, Soul': 'text-pink-400 bg-pink-400/20',
      'Folk, Traditional Irish': 'text-green-400 bg-green-400/20',
      'Folk Rock, Art Pop': 'text-purple-400 bg-purple-400/20',
      'Progressive Rock, Folk Rock': 'text-blue-400 bg-blue-400/20',
      'Alternative Rock, Jangle Pop': 'text-cyan-400 bg-cyan-400/20',
      'Roots Rock, Country Rock': 'text-amber-400 bg-amber-400/20',
      'Celtic Folk Ballad, Celtic Rock, Folk Rock': 'text-green-400 bg-green-400/20',
      'Folk, Celtic Folk': 'text-green-400 bg-green-400/20',
      'New Wave, Pop Rock': 'text-indigo-400 bg-indigo-400/20',
      'Alternative Rock, Indie Rock': 'text-cyan-400 bg-cyan-400/20',
      'Pop, Pop Ballad': 'text-pink-400 bg-pink-400/20',
      'Soft Rock, Pop Ballad': 'text-blue-400 bg-blue-400/20',
      'Alternative Rock, Indie Pop': 'text-purple-400 bg-purple-400/20',
      'Folk': 'text-green-400 bg-green-400/20',
      'Indie Dance, Alternative Rock': 'text-indigo-400 bg-indigo-400/20'
    }
    return colors[genre] || 'text-gray-400 bg-gray-400/20'
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="glass rounded-xl p-6 border border-white/10 text-center">
        <div className="text-gray-400 text-2xl mb-3">🎵</div>
        <h4 className="text-gray-300 font-semibold mb-2">
          {selectedGenre === 'all' ? 'All songs added' : `No ${selectedGenre} songs available`}
        </h4>
        <p className="text-gray-400 text-sm">
          {selectedGenre === 'all' 
            ? 'All available songs have been added to your setlist'
            : `Try selecting a different genre or add more ${selectedGenre} songs to the choir collection`
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto glass rounded-xl p-4 border border-white/10">
      {songs.map((song) => (
        <div
          key={song.id}
          onClick={() => onAddToSetlist(song)}
          className="glass rounded-lg p-3 border border-white/10 cursor-pointer
                     transition-all duration-200 hover:border-yellow-400/30 
                     hover:bg-white/5 hover:transform hover:translateX-1"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              {/* TITLE - Made more prominent and visible */}
              <h5 className="text-white font-semibold text-base leading-tight mb-2">
                {song.title || song.song_title || '[NO TITLE]'}
              </h5>
              
              {/* ARTIST AND GENRE */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-400 text-xs">
                  {song.artist || '[NO ARTIST]'}
                </span>
                <span className="text-gray-600">•</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getGenreColor(song.genre)}`}>
                  {song.genre || '[NO GENRE]'}
                </span>
              </div>
              
              {/* DURATION AND OTHER INFO */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {song.duration_minutes && (
                  <span>⏱️ {song.duration_minutes} min</span>
                )}
                
                {song.performance_notes?.difficulty && (
                  <span>⭐ {song.performance_notes.difficulty}/5</span>
                )}
              </div>
            </div>

            {/* Add Button */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full border-2 border-green-400 text-green-400 
                              hover:bg-green-400 hover:text-black flex items-center justify-center 
                              text-sm font-bold transition-colors duration-200">
                +
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
