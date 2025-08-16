// src/lib/api.js - Clean API using your YouTube utils
import { supabase } from './supabase'
import { searchYouTubeVideos, getVideoStatistics } from './youtube-utils'

// YouTube Search (using your existing function)
export const searchYouTube = async (query) => {
  const results = await searchYouTubeVideos(query)
  
  // Enhance with view counts
  const enhancedResults = await Promise.all(
    results.map(async (video) => {
      const stats = await getVideoStatistics(video.id)
      return {
        videoId: video.id,
        title: video.title,
        channelTitle: video.channelTitle,
        thumbnailUrl: video.thumbnails.medium.url,
        viewCount: parseInt(stats.viewCount) || 0
      }
    })
  )
  
  return enhancedResults
}

// Simple database operations
export const checkSuggestionsRemaining = async (userId) => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  
  const { data } = await supabase
    .from('suggestion_limits')
    .select('suggestion_count')
    .eq('user_id', userId)
    .eq('month_year', currentMonth)
    .single()

  const currentCount = data?.suggestion_count || 0
  return Math.max(0, 3 - currentCount)
}

export const submitSuggestion = async (artist, title, selectedVideo, userId) => {
  // Insert song directly
  const { data, error } = await supabase
    .from('songs')
    .insert({
      title,
      artist,
      youtube_video_id: selectedVideo.videoId,
      youtube_title: selectedVideo.title,
      youtube_view_count: selectedVideo.viewCount,
      suggested_by: userId
    })
    .select()
    .single()

  if (error) throw error
  
  // Update suggestion count
  const currentMonth = new Date().toISOString().slice(0, 7)
  await supabase
    .from('suggestion_limits')
    .upsert({
      user_id: userId,
      month_year: currentMonth,
      suggestion_count: (await checkSuggestionsRemaining(userId)) + 1
    })

  return data
}

export const getSongsForVoting = async (userId) => {
  const { data } = await supabase
    .from('votes')
    .select(`
      id,
      songs (id, title, artist, youtube_video_id, youtube_view_count)
    `)
    .eq('user_id', userId)
    .eq('vote_status', 'pending')
    .limit(1)

  return data?.[0] || null
}

export const submitVote = async (voteId, voteType) => {
  return await supabase
    .from('votes')
    .update({
      vote_type: voteType,
      vote_status: 'completed',
      voted_at: new Date().toISOString()
    })
    .eq('id', voteId)
}

export const getRankings = async () => {
  try {
    console.log('Calling get_song_rankings RPC function...')
    
    const { data, error } = await supabase.rpc('get_song_rankings')
    
    if (error) {
      console.error('Supabase RPC error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`RPC function failed: ${error.message}`)
    }
    
    console.log('RPC call successful! Received data:', {
      isArray: Array.isArray(data),
      length: data?.length || 0,
      firstItem: data?.[0] || null
    })
    
    if (!data || !Array.isArray(data)) {
      throw new Error('RPC function returned invalid data format')
    }
    
    // Validate the data structure
    if (data.length > 0) {
      const firstSong = data[0]
      const requiredFields = ['song_id', 'title', 'artist', 'youtube_video_id', 'ranking']
      const missingFields = requiredFields.filter(field => !(field in firstSong))
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields)
        console.error('Available fields:', Object.keys(firstSong))
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }
      
      console.log('Data validation successful. Processing', data.length, 'songs')
    }
    
    // Sort by ranking, then by title for consistent ordering
    const sortedData = data.sort((a, b) => {
      if (a.ranking !== b.ranking) {
        return a.ranking - b.ranking
      }
      return a.title.localeCompare(b.title)
    })
    
    console.log('Successfully processed rankings data')
    return sortedData
    
  } catch (err) {
    console.error('Error in getRankings:', err)
    throw err // Re-throw the error so the UI can handle it properly
  }
}

// Debug function you can call from browser console to test RPC directly
export const testRPCFunction = async () => {
  console.log('Testing RPC function directly...')
  
  try {
    // Test the RPC function call
    const result = await supabase.rpc('get_song_rankings')
    
    console.log('Raw RPC result:', {
      data: result.data,
      error: result.error,
      status: result.status,
      statusText: result.statusText
    })
    
    if (result.error) {
      console.error('RPC Error Details:', {
        code: result.error.code,
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint
      })
    }
    
    if (result.data) {
      console.log('RPC Success:', {
        recordCount: result.data.length,
        firstRecord: result.data[0],
        allRecords: result.data
      })
    }
    
    return result
    
  } catch (error) {
    console.error('Exception during RPC test:', error)
    return { error }
  }
}

// Also test basic table access
export const testBasicQueries = async () => {
  console.log('Testing basic table queries...')
  
  try {
    // Test songs table access
    const songsResult = await supabase
      .from('songs')
      .select('id, title, artist, youtube_video_id, youtube_view_count')
      .limit(5)
    
    console.log('Songs query result:', songsResult)
    
    // Test votes table access  
    const votesResult = await supabase
      .from('votes')
      .select('id, song_id, user_id, vote_type, vote_status')
      .limit(5)
    
    console.log('Votes query result:', votesResult)
    
    return { songsResult, votesResult }
    
  } catch (error) {
    console.error('Exception during basic queries:', error)
    return { error }
  }
}

export const getVotingStats = async (userId) => {
  // Get total pending votes for user
  const { data: pendingVotes } = await supabase
    .from('votes')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('vote_status', 'pending')

  // Get votes completed today
  const today = new Date().toISOString().split('T')[0]
  const { data: todayVotes } = await supabase
    .from('votes')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('vote_status', 'completed')
    .gte('voted_at', today)

  return {
    songsToVote: pendingVotes?.length || 0,
    votedToday: todayVotes?.length || 0
  }
}

export const getChoirSongs = async () => {
  // Mock data for choir songs
  return [
    {
      id: '1',
      title: 'Amazing Grace',
      artist: 'Traditional',
      genre: 'Gospel',
      duration_minutes: 4,
      date_introduced: '2024-12-01'
    },
    {
      id: '2',
      title: 'Danny Boy',
      artist: 'Traditional Irish',
      genre: 'Irish Folk',
      duration_minutes: 5,
      date_introduced: '2024-11-15'
    },
    {
      id: '3',
      title: 'How Great Thou Art',
      artist: 'Carl Boberg',
      genre: 'Hymn',
      duration_minutes: 4,
      date_introduced: '2024-10-20'
    },
    {
      id: '4',
      title: 'The Parting Glass',
      artist: 'Traditional',
      genre: 'Irish Folk',
      duration_minutes: 3,
      date_introduced: '2024-10-01'
    }
  ]
}

// Debug function you can call from browser console to test RPC directly
export const testRPCFunction = async () => {
  console.log('Testing RPC function directly...')
  
  try {
    // Test the RPC function call
    const result = await supabase.rpc('get_song_rankings')
    
    console.log('Raw RPC result:', {
      data: result.data,
      error: result.error,
      status: result.status,
      statusText: result.statusText
    })
    
    if (result.error) {
      console.error('RPC Error Details:', {
        code: result.error.code,
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint
      })
    }
    
    if (result.data) {
      console.log('RPC Success:', {
        recordCount: result.data.length,
        firstRecord: result.data[0],
        allRecords: result.data
      })
    }
    
    return result
    
  } catch (error) {
    console.error('Exception during RPC test:', error)
    return { error }
  }
}

// Also test basic table access
export const testBasicQueries = async () => {
  console.log('Testing basic table queries...')
  
  try {
    // Test songs table access
    const songsResult = await supabase
      .from('songs')
      .select('id, title, artist, youtube_video_id, youtube_view_count')
      .limit(5)
    
    console.log('Songs query result:', songsResult)
    
    // Test votes table access  
    const votesResult = await supabase
      .from('votes')
      .select('id, song_id, user_id, vote_type, vote_status')
      .limit(5)
    
    console.log('Votes query result:', votesResult)
    
    return { songsResult, votesResult }
    
  } catch (error) {
    console.error('Exception during basic queries:', error)
    return { error }
  }
}
