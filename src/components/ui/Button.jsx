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
    sm: 'px-3 py-2 text-xs min-h-[2.5rem]',
    md: 'px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base min-h-[3rem] sm:min-h-[3.5rem]',
    lg: 'responsive-button'
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
        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
