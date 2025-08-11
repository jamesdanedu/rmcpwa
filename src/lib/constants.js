export const APP_CONFIG = {
  name: 'RMCBuddy',
  shortName: 'RMCBuddy',
  description: 'Roscommon Mens Choir song management app',
  themeColor: '#FFD700',
  backgroundColor: '#111127',
  
  colors: {
    primary: '#FFD700',    // Primrose
    secondary: '#4169E1',  // Royal Blue
    background: '#111127',
    surface: '#1a1a3a'
  },
  
  maxSuggestionsPerMonth: 3,
  sessionDuration: 45 * 24 * 60 * 60 * 1000, // 45 days
  autoArchiveDays: 30
}

export const GENRES = [
  'Christmas',
  'Irish Folk', 
  'Gospel',
  'Hymn',
  'Contemporary',
  'Jazz Standard',
  'Classical',
  'Traditional'
]

export const VOTE_TYPES = {
  UP: 'up',
  DOWN: 'down', 
  SKIP: 'skip'
}

export const TABS = [
  { id: 'suggest', label: 'Suggest', icon: '💡' },
  { id: 'vote', label: 'Vote', icon: '🗳️' },
  { id: 'ranking', label: 'Ranking', icon: '🏆' },
  { id: 'choir-songs', label: 'Choir Songs', icon: '🎼' }
]
