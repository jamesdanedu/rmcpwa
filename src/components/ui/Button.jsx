import { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wide'
  
  const variants = {
    primary: 'gradient-roscommon text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none',
    secondary: 'glass text-white border border-white/20 hover:bg-white/10 disabled:opacity-50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 disabled:opacity-50'
  }
  
  const sizes = {
    sm: 'px-4 py-3 text-sm min-h-[3rem]',
    md: 'px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg min-h-[3.5rem] sm:min-h-[4rem]',
    lg: 'px-8 sm:px-10 py-5 sm:py-6 text-lg sm:text-xl min-h-[4rem] sm:min-h-[4.5rem]'
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
