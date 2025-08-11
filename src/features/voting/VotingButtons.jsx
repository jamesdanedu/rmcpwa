'use client'

import Button from '../../components/ui/Button'

export default function VotingButtons({ onVote, isVoting, disabled }) {
  const buttons = [
    {
      type: 'up',
      label: 'YES',
      icon: '👍',
      variant: 'primary',
      bgClass: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      type: 'down', 
      label: 'NO',
      icon: '👎',
      variant: 'primary',
      bgClass: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    },
    {
      type: 'skip',
      label: 'SKIP',
      icon: '⏭️',
      variant: 'secondary',
      bgClass: ''
    }
  ]

  return (
    <div className="flex gap-3">
      {buttons.map((button) => (
        <button
          key={button.type}
          onClick={() => onVote(button.type)}
          disabled={disabled || isVoting}
          className={`
            flex-1 flex flex-col items-center gap-2 py-5 px-4 rounded-2xl
            font-bold text-sm uppercase tracking-wide border-2
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            ${button.variant === 'primary' 
              ? `bg-gradient-to-b ${button.bgClass} text-white border-transparent 
                 hover:transform hover:scale-105 hover:shadow-xl
                 disabled:transform-none disabled:shadow-none`
              : `glass text-gray-300 border-white/20 hover:bg-white/10 hover:border-white/30`
            }
          `}
        >
          <span className="text-2xl">
            {isVoting ? '⏳' : button.icon}
          </span>
          <span className="text-xs font-bold">
            {isVoting ? 'VOTING...' : button.label}
          </span>
        </button>
      ))}
    </div>
  )
}
