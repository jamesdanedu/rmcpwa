'use client'

export default function NoSongsToVote() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="glass rounded-3xl p-12 border border-white/10 text-center max-w-md w-full shadow-2xl">
        
        {/* Large Musical Note Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center border border-blue-400/30">
          <span className="text-6xl">🎵</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <span className="text-pink-400">💖</span>
            Vote for Songs
          </h2>
          
          <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full mx-auto mb-4"></div>
          
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No more songs to vote on!
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed">
            You've voted on all available songs. New songs will appear here when suggested.
          </p>
        </div>

        {/* What's Next Section */}
        <div className="glass rounded-2xl p-6 border border-white/5 bg-white/5">
          <h4 className="text-yellow-400 font-bold mb-4 text-sm flex items-center justify-center gap-2">
            <span>✨</span>
            What's next?
          </h4>
          
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <span className="text-lg">💡</span>
              <span>Suggest new songs for the choir</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-lg">🏆</span>
              <span>Check the current song rankings</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-lg">🎼</span>
              <span>Browse the choir's song collection</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-lg">📅</span>
              <span>Create setlists for upcoming gigs</span>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="inline-block animate-pulse mr-1">🔔</span>
            You'll be notified when new songs are available to vote on
          </p>
        </div>
      </div>
    </div>
  )
}
