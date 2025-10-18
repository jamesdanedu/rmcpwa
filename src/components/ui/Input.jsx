import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '',
  as = 'input',
  ...props 
}, ref) => {
  const Component = as

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm sm:text-base font-semibold text-gray-200">
          {label}
          {props.required && <span className="text-yellow-400 ml-1">*</span>}
        </label>
      )}
      
      <Component
        ref={ref}
        className={`
          w-full rounded-xl 
          bg-black/40 backdrop-blur-sm
          text-white placeholder-gray-500
          border-2 transition-all duration-200
          px-4 py-3 sm:px-5 sm:py-4
          text-base sm:text-lg
          ${error 
            ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/20' 
            : 'border-white/20 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20'
          }
          hover:border-white/30
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-red-400 text-xs sm:text-sm font-medium flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
