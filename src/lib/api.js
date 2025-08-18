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

// Fixed suggestions remaining check
export const checkSuggestionsRemaining = async (userId) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7) // "2025-08"
    
    console.log('Checking suggestions for user:', userId, 'month:', currentMonth)
    
    const { data, error } = await supabase
      .from('suggestion_limits')
      .select('suggestion_count')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .maybeSingle() // Use maybeSingle instead of single to avoid errors when no record exists

    if (error) {
      console.error('Error checking suggestion limits:', error)
      // If table doesn't exist or has issues, return default
      return 3
    }

    const currentCount = data?.suggestion_count || 0
    const remaining = Math.max(0, 3 - currentCount)
    
    console.log('Current suggestions used:', currentCount, 'Remaining:', remaining)
    return remaining
    
  } catch (err) {
    console.error('Error in checkSuggestionsRemaining:', err)
    // Return default if there's any error
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

    if (error) throw error
    
    // Update suggestion count - handle case where record doesn't exist
    const currentMonth = new Date().toISOString().slice(0, 7)
    
    try {
      const { error: upsertError } = await supabase
        .from('suggestion_limits')
        .upsert({
          user_id: userId,
          month_year: currentMonth,
          suggestion_count: 1 // Start with 1 if new record, or increment if exists
        }, {
          onConflict: 'user_id,month_year',
          ignoreDuplicates: false
        })
      
      if (upsertError) {
        console.error('Error updating suggestion count:', upsertError)
        // Don't fail the suggestion if we can't update the counter
      }
    } catch (countError) {
      console.error('Error with suggestion counting:', countError)
      // Don't fail the suggestion if we can't update the counter
    }

    return data
  } catch (error) {
    console.error('Error submitting suggestion:', error)
    throw error
  }
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

// Add better error handling and sorting to your existing getRankings function
export const getRankings = async () => {
  try {
    console.log('Calling get_song_rankings RPC function...')
    const { data, error } = await supabase.rpc('get_song_rankings')
    
    if (error) {
      console.error('Supabase RPC error:', error)
      throw new Error('Failed to fetch rankings from database')
    }
    
    console.log('RPC call successful! Received data:', {
      isArray: Array.isArray(data),
      length: data?.length,
      firstItem: data?.[0]
    })
    
    // Validate the data structure
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data, data)
      throw new Error('Invalid data format received from rankings')
    }
    
    console.log('Data validation successful. Processing', data.length, 'songs')
    
    // Sort by ranking, then by title for consistent ordering
    const sortedData = data.sort((a, b) => {
      // First sort by ranking (nulls last)
      if (a.ranking === null && b.ranking === null) return a.title.localeCompare(b.title)
      if (a.ranking === null) return 1
      if (b.ranking === null) return -1
      if (a.ranking !== b.ranking) return a.ranking - b.ranking
      
      // Then by title for ties
      return a.title.localeCompare(b.title)
    })
    
    console.log('Successfully processed rankings data')
    return sortedData
    
  } catch (err) {
    console.error('Error in getRankings:', err)
    throw err
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

// Get choir songs from the choir_songs table
export const getChoirSongs = async () => {
  try {
    console.log('Fetching choir songs from database...')
    
    const { data, error } = await supabase
      .from('choir_songs')
      .select('*')
      .order('date_introduced', { ascending: false })

    if (error) {
      console.error('Error fetching choir songs:', error)
      throw error
    }

    console.log('Successfully fetched', data?.length || 0, 'choir songs')
    return data || []
    
  } catch (err) {
    console.error('Error in getChoirSongs:', err)
    throw err
  }
}

// Create a new setlist
export const createSetlist = async (setlistData, userId) => {
  try {
    const { data, error } = await supabase
      .from('setlists')
      .insert({
        ...setlistData,
        created_by: userId,
        is_archived: false
      })
      .select()
      .single()

    if (error) throw error
    return data
    
  } catch (err) {
    console.error('Error creating setlist:', err)
    throw err
  }
}

// Get setlists (if you have a setlists table)
export const getSetlists = async () => {
  try {
    const { data, error } = await supabase
      .from('setlists')
      .select('*')
      .order('event_date', { ascending: false })

    if (error) {
      console.error('Error fetching setlists:', error)
      // Return empty array if table doesn't exist yet
      return []
    }

    return data || []
    
  } catch (err) {
    console.error('Error in getSetlists:', err)
    // Return empty array if there's any error
    return []
  }
}
