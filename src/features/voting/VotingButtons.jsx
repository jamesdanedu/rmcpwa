'use client'

export default function VotingButtons({ onVote, isVoting, disabled }) {
  const buttons = [
    {
      type: 'up',
      icon: '👍',
      bgClass: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      shadowColor: 'shadow-green-500/30 hover:shadow-green-500/50'
    },
    {
      type: 'down', 
      icon: '👎',
      bgClass: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      shadowColor: 'shadow-red-500/30 hover:shadow-red-500/50'
    },
    {
      type: 'skip',
      icon: '⏭️',
      bgClass: 'glass border-2 border-white/30 hover:bg-white/10 hover:border-white/50',
      shadowColor: 'shadow-white/20 hover:shadow-white/30'
    }
  ]

  return (
    <div className="flex justify-center gap-4">
      {buttons.map((button) => (
        <button
          key={button.type}
          onClick={() => onVote(button.type)}
          disabled={disabled || isVoting}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center text-2xl
            transition-all duration-300 font-bold
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            transform hover:scale-110 hover:-translate-y-1 active:scale-95
            ${button.type === 'skip' 
              ? `${button.bgClass} text-gray-300` 
              : `bg-gradient-to-b ${button.bgClass} text-white border-none`
            }
            shadow-lg ${button.shadowColor}
          `}
        >
          {isVoting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            button.icon
          )}
        </button>
      ))}
    </div>
  )
}
