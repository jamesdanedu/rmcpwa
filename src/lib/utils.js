/**
 * Format view count numbers (same as YouTube utils but more general)
 */
export function formatNumber(num) {
  if (!num) return '0'
  if (num < 1000) return num.toString()
  if (num < 1000000) return (num / 1000).toFixed(1).replace('.0', '') + 'K'
  if (num < 1000000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
  return (num / 1000000000).toFixed(2).replace('.00', '').replace(/\.?0+$/, '') + 'B'
}

/**
 * Format duration in minutes to human readable
 */
export function formatDuration(minutes) {
  if (!minutes) return '0 min'
  if (minutes < 60) return `${minutes} min`
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Debounce function calls
 */
export function debounce(func, wait) {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Generate a random ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Clamp a number between min and max
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

/**
 * Check if we're in a browser environment
 */
export function isBrowser() {
  return typeof window !== 'undefined'
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str, length = 100) {
  if (!str || str.length <= length) return str
  return str.substring(0, length) + '...'
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date) {
  return new Date(date) < new Date()
}

/**
 * Get relative time string
 */
export function getRelativeTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}
