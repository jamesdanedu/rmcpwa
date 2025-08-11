'use client'

export default function DurationTracker({ currentDuration, targetDuration, songCount }) {
  const percentage = targetDuration > 0 ? Math.min((currentDuration / targetDuration) * 100, 100) : 0
  
  const getProgressColor = () => {
    if (percentage > 100) return 'bg-red-500'
    if (percentage > 90) return 'bg-amber-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (targetDuration === 0) return 'No target duration set'
    if (percentage > 100) return `${currentDuration - targetDuration} minutes over target`
    if (percentage > 90) return 'Close to target duration'
    return `${targetDuration - currentDuration} minutes remaining`
  }

  const getStatusEmoji = () => {
    if (targetDuration === 0) return '⏱️'
    if (percentage > 100) return '⚠️'
    if (percentage > 90) return '🟡'
    return '✅'
  }

  return (
    <div className="glass rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="text-yellow-400 font-bold text-lg">
          {currentDuration} {targetDuration > 0 && `/ ${targetDuration}`} minutes
        </div>
        <div className="text-gray-400 text-sm">
          {songCount} song{songCount !== 1 ? 's' : ''}
        </div>
      </div>

      {targetDuration > 0 && (
        <>
          {/* Progress Bar */}
          <div className="bg-gray-800 h-3 rounded-full overflow-hidden mb-3">
            <div 
              className={`h-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>{getStatusEmoji()}</span>
            <span className="text-gray-400">{getStatusText()}</span>
          </div>
        </>
      )}
    </div>
  )
}
