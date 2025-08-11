'use client'

export default function NoSongsToVote() {
  return (
    <div className="glass rounded-2xl p-8 border border-white/10 text-center">
      <div className="text-4xl mb-4">🎉</div>
      <h3 className="text-xl font-bold text-white mb-3">
        All caught up!
      </h3>
      <p className="text-gray-400 mb-6">
        You've voted on all available songs. Great job helping the choir choose new music!
      </p>
      
      <div className="space-y-4">
        <div className="glass rounded-xl p-4 border border-white/5">
          <h4 className="text-yellow-400 font-semibold mb-2">
            What's next?
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p>💡 Suggest new songs for the choir</p>
            <p>🏆 Check the current song rankings</p>
            <p>🎼 Browse the choir's song collection</p>
            <p>📅 Create setlists for upcoming gigs</p>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          New songs to vote on will appear here as members make suggestions
        </div>
      </div>
    </div>
  )
}
