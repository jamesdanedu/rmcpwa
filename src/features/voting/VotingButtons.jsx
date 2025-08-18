'use client'

export default function VotingButtons({ onVote, isVoting, disabled }) {
  const buttons = [
    {
      type: 'up',
      label: 'YES',
      icon: '👍',
      description: 'Love it!',
      bgClass: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      shadowColor: 'shadow-green-500/25 hover:shadow-green-500/40'
    },
    {
      type: 'down', 
      label: 'NO',
      icon: '👎',
      description: 'Not for us',
      bgClass: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      shadowColor: 'shadow-red-500/25 hover:shadow-red-500/40'
    },
    {
      type: 'skip',
      label: 'SKIP',
      icon: '⏭️',
      description: 'Decide later',
      bgClass: 'glass border-2 border-white/20 hover:bg-white/10 hover:border-white/30',
      shadowColor: 'shadow-white/10 hover:shadow-white/20'
    }
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto">
      {buttons.map((button) => (
        <button
          key={button.type}
          onClick={() => onVote(button.type)}
          disabled={disabled || isVoting}
          className={`
            flex-1 flex flex-col items-center gap-3 py-6 px-6 rounded-2xl
            font-bold text-sm uppercase tracking-wide transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            transform hover:scale-105 hover:-translate-y-1 active:scale-95
            ${button.type === 'skip' 
              ? `${button.bgClass} text-gray-300` 
              : `bg-gradient-to-b ${button.bgClass} text-white border-none`
            }
            shadow-xl ${button.shadowColor}
          `}
        >
          {/* Icon */}
          <span className="text-4xl transform transition-transform duration-200 group-hover:scale-110">
            {isVoting && button.type !== 'skip' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              button.icon
            )}
          </span>
          
          {/* Label */}
          <div className="text-center">
            <div className="font-bold text-base mb-1">
              {isVoting && button.type !== 'skip' ? 'VOTING...' : button.label}
            </div>
            <div className={`text-xs font-normal opacity-80 ${
              button.type === 'skip' ? 'text-gray-400' : 'text-white/80'
            }`}>
              {isVoting && button.type !== 'skip' ? 'Please wait' : button.description}
            </div>
          </div>

          {/* Loading indicator for active voting */}
          {isVoting && (
            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
