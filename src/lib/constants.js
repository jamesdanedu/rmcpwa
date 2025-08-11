export const APP_CONFIG = {
  name: 'RMCBuddy',
  shortName: 'RMCBuddy',
  description: 'Roscommon Mens Choir song management app',
  themeColor: '#FFD700',
  backgroundColor: '#111127',
  
  // Roscommon colors
  colors: {
    primary: '#FFD700',    // Primrose
    secondary: '#4169E1',  // Royal Blue
    background: '#111127',
    surface: '#1a1a3a'
  },
  
  // Suggestion limits
  maxSuggestionsPerMonth: 3,
  
  // Session duration (45 days in milliseconds)
  sessionDuration: 45 * 24 * 60 * 60 * 1000,
  
  // Auto-archive setlists after 30 days
  autoArchiveDays: 30
}

export const GENRES = [
  'Christmas',
  'Irish Folk', 
  'Hymn',
  'Contemporary',
  'Indie',
  'Modern',
  'Classical',
  'Traditional'
]

export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5]

export const VOTE_TYPES = {
  UP: 'up',
  DOWN: 'down', 
  SKIP: 'skip'
}
