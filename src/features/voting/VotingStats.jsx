'use client'

export default function VotingStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="glass rounded-xl p-4 border border-white/10 text-center">
        <div className="text-2xl font-bold text-yellow-400 mb-1">
          {stats.songsToVote}
        </div>
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
          Songs to Vote
        </div>
      </div>
      
      <div className="glass rounded-xl p-4 border border-white/10 text-center">
        <div className="text-2xl font-bold text-yellow-400 mb-1">
          {stats.votedToday}
        </div>
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
          Voted Today
        </div>
      </div>
    </div>
  )
}
