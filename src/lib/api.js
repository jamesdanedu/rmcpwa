// src/lib/api.js - Fixed API with proper error handling
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

// Fixed suggestions remaining check with proper error handling
export const checkSuggestionsRemaining = async (userId) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7) // Format: "2025-08"
    
    console.log('Checking suggestions for user:', userId, 'month:', currentMonth)
    
    const { data, error, count } = await supabase
      .from('suggestion_limits')
      .select('suggestion_count')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .maybeSingle() // Use maybeSingle instead of single to handle no results

    if (error) {
      console.error('Supabase error:', error)
      // If table doesn't exist or other database error, return default
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.warn('suggestion_limits table may not exist, returning default value')
        return 3 // Default to 3 suggestions available
      }
      throw error
    }

    const currentCount = data?.suggestion_count || 0
    const remaining = Math.max(0, 3 - currentCount)
    
    console.log('Current suggestion count:', currentCount, 'Remaining:', remaining)
    return remaining
    
  } catch (error) {
    console.error('Error checking suggestions remaining:', error)
    // Fallback to default value instead of breaking the app
    return 3
  }
}

export const submitSuggestion = async (artist, title, selectedVideo, userId) => {
  try {
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

    if (error) {
      console.error('Error inserting song:', error)
      throw error
    }
    
    // Try to update suggestion count, but don't fail if table doesn't exist
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const currentRemaining = await checkSuggestionsRemaining(userId)
      const newCount = Math.max(0, 3 - currentRemaining + 1)
      
      await supabase
        .from('suggestion_limits')
        .upsert({
          user_id: userId,
          month_year: currentMonth,
          suggestion_count: newCount
        })
    } catch (limitError) {
      console.warn('Could not update suggestion limit:', limitError)
      // Continue anyway - the song was submitted successfully
    }

    return data
    
  } catch (error) {
    console.error('Error submitting suggestion:', error)
    throw error
  }
}

export const getSongsForVoting = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select(`
        id,
        songs (id, title, artist, youtube_video_id, youtube_view_count)
      `)
      .eq('user_id', userId)
      .eq('vote_status', 'pending')
      .limit(1)

    if (error) {
      console.error('Error getting songs for voting:', error)
      return null
    }

    return data?.[0] || null
    
  } catch (error) {
    console.error('Error in getSongsForVoting:', error)
    return null
  }
}

export const submitVote = async (voteId, voteType) => {
  try {
    const { data, error } = await supabase
      .from('votes')
      .update({
        vote_type: voteType,
        vote_status: 'completed',
        voted_at: new Date().toISOString()
      })
      .eq('id', voteId)

    if (error) {
      console.error('Error submitting vote:', error)
      throw error
    }

    return data
    
  } catch (error) {
    console.error('Error in submitVote:', error)
    throw error
  }
}

export const getRankings = async () => {
  try {
    console.log('Attempting to fetch rankings...')
    
    const { data, error } = await supabase.rpc('get_song_rankings')
    
    console.log('Raw RPC response:', { data, error })
    
    if (error) {
      console.error('Supabase RPC error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error('Failed to fetch rankings from database')
    }
    
    if (!data || data.length === 0) {
      console.warn('No ranking data returned')
    }
    
    // Sort by ranking, then by title for consistent ordering
    const sortedData = (data || []).sort((a, b) => {
      if (a.ranking !== b.ranking) {
        return a.ranking - b.ranking
      }
      return a.title.localeCompare(b.title)
    })
    
    return sortedData
  } catch (err) {
    console.error('Comprehensive error in getRankings:', err)
    throw err
  }
}

export const getVotingStats = async (userId) => {
  try {
    // Get total pending votes for user
    const { data: pendingVotes, error: pendingError } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('vote_status', 'pending')

    if (pendingError) {
      console.error('Error getting pending votes:', pendingError)
    }

    // Get votes completed today
    const today = new Date().toISOString().split('T')[0]
    const { data: todayVotes, error: todayError } = await supabase
      .from('votes')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('vote_status', 'completed')
      .gte('voted_at', today)

    if (todayError) {
      console.error('Error getting today votes:', todayError)
    }

    return {
      songsToVote: pendingVotes?.length || 0,
      votedToday: todayVotes?.length || 0
    }
    
  } catch (error) {
    console.error('Error getting voting stats:', error)
    return {
      songsToVote: 0,
      votedToday: 0
    }
  }
}

// Add function to get choir songs
export const getChoirSongs = async () => {
  try {
    const { data, error } = await supabase
      .from('choir_songs')
      .select('*')
      .order('title')

    if (error) {
      console.error('Error getting choir songs:', error)
      // Return mock data if table doesn't exist
      if (error.code === 'PGRST116' || error.code === '42P01') {
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
          }
        ]
      }
      throw error
    }

    return data || []
    
  } catch (error) {
    console.error('Error in getChoirSongs:', error)
    return []
  }
}
