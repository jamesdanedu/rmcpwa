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
        <label className="block text-sm font-semibold text-gray-200">
          {label}
        </label>
      )}
      
      <Component
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-xl glass text-white placeholder-gray-400
          border-2 border-white/10 focus:border-yellow-400 focus:outline-none
          transition-colors duration-200 text-base
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-red-400 text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
