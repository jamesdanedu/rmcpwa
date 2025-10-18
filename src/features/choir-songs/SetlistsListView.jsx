'use client'

import { isAfter, subDays, parseISO, compareDesc } from 'date-fns'
import SetlistCard from './SetlistCard'

export default function SetlistsListView({ setlists, onSetlistClick }) {
  if (setlists.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-white/10 text-center">
        <div className="text-4xl mb-4">🎼</div>
        <h3 className="text-xl font-bold text-white mb-3">
          No Setlists Yet
        </h3>
        <p className="text-gray-400 mb-6">
          Create your first setlist to organize songs for performances and gigs.
        </p>
        
        <div className="glass rounded-xl p-4 border border-white/5">
          <h4 className="text-yellow-400 font-semibold mb-2">
            Setlist Features
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p>• Organize songs by performance order</p>
            <p>• Track total duration for time limits</p>
            <p>• Filter songs by genre for themed events</p>
            <p>• Generate PDF setlists for printing</p>
            <p>• View detailed setlist information</p>
          </div>
        </div>
      </div>
    )
  }

  // Sort setlists by event date (newest first)
  const sortedSetlists = [...setlists].sort((a, b) => {
    const dateA = parseISO(a.event_date)
    const dateB = parseISO(b.event_date)
    return compareDesc(dateA, dateB) // Newest first
  })

  // Separate into upcoming and past
  const now = new Date()
  const archiveThreshold = subDays(now, 30)
  
  const upcomingSetlists = sortedSetlists.filter(setlist => {
    const eventDate = parseISO(setlist.event_date)
    return !setlist.is_archived && isAfter(eventDate, now)
  })
  
  const recentSetlists = sortedSetlists.filter(setlist => {
    const eventDate = parseISO(setlist.event_date)
    return !setlist.is_archived && 
           !isAfter(eventDate, now) && 
           isAfter(eventDate, archiveThreshold)
  })
  
  const archivedSetlists = sortedSetlists.filter(setlist => {
    const eventDate = parseISO(setlist.event_date)
    return setlist.is_archived || !isAfter(eventDate, archiveThreshold)
  })

  return (
    <div className="space-y-8">
      {/* Upcoming Setlists */}
      {upcomingSetlists.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl 
                          bg-gradient-to-br from-green-400 to-green-600">
              <span className="text-white text-xl">📅</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Upcoming Events
              </h3>
              <p className="text-sm text-gray-400">
                {upcomingSetlists.length} scheduled performance{upcomingSetlists.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {upcomingSetlists.map((setlist) => (
              <SetlistCard 
                key={setlist.id} 
                setlist={setlist}
                status="upcoming"
                onClick={() => onSetlistClick(setlist)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent/Past Setlists */}
      {recentSetlists.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl 
                          bg-gradient-to-br from-blue-400 to-blue-600">
              <span className="text-white text-xl">🎵</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Recent Performances
              </h3>
              <p className="text-sm text-gray-400">
                {recentSetlists.length} performance{recentSetlists.length !== 1 ? 's' : ''} in the last 30 days
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {recentSetlists.map((setlist) => (
              <SetlistCard 
                key={setlist.id} 
                setlist={setlist}
                status="past"
                onClick={() => onSetlistClick(setlist)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Archived Setlists */}
      {archivedSetlists.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl 
                          bg-gradient-to-br from-gray-500 to-gray-700">
              <span className="text-white text-xl">📦</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-400">
                Archived
              </h3>
              <p className="text-sm text-gray-500">
                {archivedSetlists.length} older performance{archivedSetlists.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {archivedSetlists.map((setlist) => (
              <SetlistCard 
                key={setlist.id} 
                setlist={setlist}
                status="archived"
                onClick={() => onSetlistClick(setlist)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
