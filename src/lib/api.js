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

// Add better error handling and sorting to your existing getRankings function

export const getRankings = async () => {
  try {
    const { data, error } = await supabase.rpc('get_song_rankings')
    
    if (error) {
      console.error('Supabase RPC error:', error)
      throw new Error('Failed to fetch rankings from database')
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

