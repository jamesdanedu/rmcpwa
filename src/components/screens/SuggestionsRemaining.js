'use client'

export default function SuggestionsRemaining({ remaining }) {
  const getStatusColor = () => {
    if (remaining === 0) return 'from-red-500 to-red-600'
    if (remaining === 1) return 'from-orange-500 to-orange-600'
    return 'from-amber-500 to-amber-600'
  }

  const getStatusEmoji = () => {
    if (remaining === 0) return '🚫'
    if (remaining === 1) return '⚠️'
    return '🎵'
  }

  return (
    <div className={`bg-gradient-to-r ${getStatusColor()} text-white p-4 rounded-xl text-center font-semibold`}>
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg">{getStatusEmoji()}</span>
        <span>
          You have <strong>{remaining}</strong> suggestion{remaining !== 1 ? 's' : ''} remaining this month
        </span>
      </div>
    </div>
  )
}
