// src/lib/api.js - Complete API using your YouTube utils
import { supabase } from './supabase'
import { searchYouTubeVideos, getVideoStatistics } from './youtube-utils'

// ============================================================================
// YOUTUBE SEARCH
// ============================================================================

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

// ============================================================================
// SUGGESTIONS
// ============================================================================

export const checkSuggestionsRemaining = async (userId) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7) // "2025-01"
    
    if (window.rmcDebugLogging) {
      console.log('Checking suggestions for user:', userId, 'month:', currentMonth)
    }
    
    const { data, error } = await supabase
      .from('suggestion_limits')
      .select('suggestion_count')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .maybeSingle()

    if (error) {
      console.error('Error checking suggestion limits:', error)
      return 3
    }

    const currentCount = data?.suggestion_count || 0
    const remaining = Math.max(0, 3 - currentCount)
    
    if (window.rmcDebugLogging) {
      console.log('Current suggestions used:', currentCount, 'Remaining:', remaining)
    }
    return remaining
    
  } catch (err) {
    console.error('Error in checkSuggestionsRemaining:', err)
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
    
    // Update suggestion count
    const currentMonth = new Date().toISOString().slice(0, 7)
    
    try {
      const { error: upsertError } = await supabase
        .from('suggestion_limits')
        .upsert({
          user_id: userId,
          month_year: currentMonth,
          suggestion_count: 1
        }, {
          onConflict: 'user_id,month_year',
          ignoreDuplicates: false
        })
      
      if (upsertError) {
        console.error('Error updating suggestion count:', upsertError)
      }
    } catch (countError) {
      console.error('Error with suggestion counting:', countError)
    }

    return data
  } catch (error) {
    console.error('Error submitting suggestion:', error)
    throw error
  }
}

// ============================================================================
// VOTING
// ============================================================================

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
  try {
    console.log('Submitting vote:', { voteId, voteType })
    
    const { data, error } = await supabase
      .from('votes')
      .update({
        vote_type: voteType,
        vote_status: 'completed',
        voted_at: new Date().toISOString()
      })
      .eq('id', voteId)
      .select() // CRITICAL FIX: Returns the updated row(s)
    
    // Check for Supabase errors
    if (error) {
      console.error('Supabase error submitting vote:', error)
      throw new Error(`Failed to submit vote: ${error.message}`)
    }
    
    // CRITICAL FIX: Verify that a row was actually updated
    if (!data || data.length === 0) {
      console.error('No vote record was updated. Vote ID:', voteId)
      throw new Error('Vote record not found or already completed')
    }
    
    console.log('Vote submitted successfully:', data[0])
    return { data: data[0], error: null }
    
  } catch (err) {
    console.error('Error in submitVote:', err)
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

// ============================================================================
// RANKINGS
// ============================================================================

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
    
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data, data)
      throw new Error('Invalid data format received from rankings')
    }
    
    console.log('Data validation successful. Processing', data.length, 'songs')
    
    // Sort by ranking, then by title for consistent ordering
    const sortedData = data.sort((a, b) => {
      if (a.ranking === null && b.ranking === null) return a.title.localeCompare(b.title)
      if (a.ranking === null) return 1
      if (b.ranking === null) return -1
      if (a.ranking !== b.ranking) return a.ranking - b.ranking
      return a.title.localeCompare(b.title)
    })
    
    console.log('Successfully processed rankings data')
    return sortedData
    
  } catch (err) {
    console.error('Error in getRankings:', err)
    throw err
  }
}

// ============================================================================
// CHOIR SONGS CRUD OPERATIONS
// ============================================================================

// READ: Get all choir songs
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

// READ: Get a single choir song by ID
export const getChoirSongById = async (songId) => {
  try {
    console.log('Fetching choir song by ID:', songId)
    
    const { data, error } = await supabase
      .from('choir_songs')
      .select('*')
      .eq('id', songId)
      .single()

    if (error) {
      console.error('Error fetching choir song:', error)
      throw error
    }

    console.log('Successfully fetched song:', data.title)
    return data
    
  } catch (err) {
    console.error('Error in getChoirSongById:', err)
    throw err
  }
}

// CREATE: Add a new choir song
export const createChoirSong = async (songData) => {
  try {
    console.log('Creating choir song:', songData.title)
    
    // Validate required fields
    if (!songData.title?.trim()) {
      throw new Error('Song title is required')
    }
    if (!songData.artist?.trim()) {
      throw new Error('Artist name is required')
    }
    
    const { data, error } = await supabase
      .from('choir_songs')
      .insert({
        title: songData.title.trim(),
        artist: songData.artist.trim(),
        genre: songData.genre || 'Other',
        lyrics: songData.lyrics?.trim() || null,
        duration_minutes: songData.durationMinutes || null,
        date_introduced: songData.dateIntroduced || new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating choir song:', error)
      throw error
    }
    
    console.log('Choir song created successfully:', data.title)
    return data
    
  } catch (err) {
    console.error('Error in createChoirSong:', err)
    throw err
  }
}

// UPDATE: Update an existing choir song
export const updateChoirSong = async (songId, songData) => {
  try {
    console.log('Updating choir song:', songId)
    
    // Validate required fields
    if (!songData.title?.trim()) {
      throw new Error('Song title is required')
    }
    if (!songData.artist?.trim()) {
      throw new Error('Artist name is required')
    }
    
    const { data, error } = await supabase
      .from('choir_songs')
      .update({
        title: songData.title.trim(),
        artist: songData.artist.trim(),
        genre: songData.genre || 'Other',
        lyrics: songData.lyrics?.trim() || null,
        duration_minutes: songData.durationMinutes || null,
        date_introduced: songData.dateIntroduced
      })
      .eq('id', songId)
      .select()
      .single()

    if (error) {
      console.error('Error updating choir song:', error)
      throw error
    }
    
    console.log('Choir song updated successfully:', data.title)
    return data
    
  } catch (err) {
    console.error('Error in updateChoirSong:', err)
    throw err
  }
}

// DELETE: Delete a choir song (with safety check for setlist usage)
export const deleteChoirSong = async (songId) => {
  try {
    console.log('Deleting choir song:', songId)
    
    // First, check if this song is used in any setlists
    const { data: setlistSongs, error: checkError } = await supabase
      .from('setlist_songs')
      .select('setlist_id')
      .eq('song_id', songId)
      .limit(1)
    
    if (checkError) {
      console.error('Error checking setlist usage:', checkError)
      throw checkError
    }
    
    if (setlistSongs && setlistSongs.length > 0) {
      throw new Error('Cannot delete song: it is currently used in one or more setlists. Please remove it from all setlists first.')
    }
    
    // If not in any setlists, proceed with deletion
    const { error } = await supabase
      .from('choir_songs')
      .delete()
      .eq('id', songId)

    if (error) {
      console.error('Error deleting choir song:', error)
      throw error
    }
    
    console.log('Choir song deleted successfully')
    
  } catch (err) {
    console.error('Error in deleteChoirSong:', err)
    throw err
  }
}

// ============================================================================
// SETLISTS
// ============================================================================

// Get all setlists for a user with their songs
export const getSetlists = async (userId) => {
  try {
    console.log('Fetching setlists for user:', userId)
    
    // Get ALL setlists - everyone can view them
    // Only filtering would be for archived vs active status
    const { data, error } = await supabase
      .from('setlists')
      .select('*')
      .order('event_date', { ascending: false })

    if (error) {
      console.error('Error fetching setlists:', error)
      return []
    }
    
    console.log('Successfully fetched', data?.length || 0, 'setlists')
    return data || []
    
  } catch (err) {
    console.error('Error in getSetlists:', err)
    return []
  }
}

// Create a new setlist with songs
export const createSetlist = async (setlistData, songs, userId) => {
  try {
    console.log('Creating setlist:', setlistData.name)
    console.log('Setlist data:', setlistData)
    
    // Insert setlist
    const { data: setlist, error: setlistError } = await supabase
      .from('setlists')
      .insert({
        name: setlistData.name,
        event_date: setlistData.eventDate,
        event_time: setlistData.eventTime || null,
        eircode: setlistData.eircode || null,
        venue_notes: setlistData.venueNotes || null,
        total_duration_minutes: setlistData.totalDuration,
        song_count: songs.length,
        created_by: userId,
        is_archived: false
      })
      .select()
      .single()

    if (setlistError) {
      console.error('Error creating setlist:', setlistError)
      throw setlistError
    }
    
    console.log('Setlist created with ID:', setlist.id)

    // Insert setlist songs
    if (songs.length > 0) {
      const setlistSongs = songs.map((song, index) => ({
        setlist_id: setlist.id,
        song_id: song.id,
        position: index + 1
      }))

      const { error: songsError } = await supabase
        .from('setlist_songs')
        .insert(setlistSongs)

      if (songsError) {
        console.error('Error adding songs to setlist:', songsError)
        throw songsError
      }
      
      console.log('Added', songs.length, 'songs to setlist')
    }

    return setlist
  } catch (err) {
    console.error('Error creating setlist:', err)
    throw err
  }
}

// Update an existing setlist
export const updateSetlist = async (setlistId, setlistData, songs) => {
  try {
    console.log('Updating setlist:', setlistId)
    
    // Update setlist
    const { data: setlist, error: setlistError } = await supabase
      .from('setlists')
      .update({
        name: setlistData.name,
        event_date: setlistData.eventDate,
        event_time: setlistData.eventTime || null,
        eircode: setlistData.eircode || null,
        venue_notes: setlistData.venueNotes || null,
        total_duration_minutes: setlistData.totalDuration,
        song_count: songs.length
      })
      .eq('id', setlistId)
      .select()
      .single()

    if (setlistError) throw setlistError

    // Delete existing setlist songs
    await supabase
      .from('setlist_songs')
      .delete()
      .eq('setlist_id', setlistId)

    // Insert new setlist songs
    if (songs.length > 0) {
      const setlistSongs = songs.map((song, index) => ({
        setlist_id: setlistId,
        song_id: song.id,
        position: index + 1
      }))

      const { error: songsError } = await supabase
        .from('setlist_songs')
        .insert(setlistSongs)

      if (songsError) throw songsError
    }

    console.log('Setlist updated successfully')
    return setlist
  } catch (err) {
    console.error('Error updating setlist:', err)
    throw err
  }
}

// Delete a setlist
export const deleteSetlist = async (setlistId) => {
  try {
    console.log('Deleting setlist:', setlistId)
    
    // Delete setlist songs first (foreign key constraint)
    await supabase
      .from('setlist_songs')
      .delete()
      .eq('setlist_id', setlistId)

    // Delete setlist
    const { error } = await supabase
      .from('setlists')
      .delete()
      .eq('id', setlistId)

    if (error) throw error
    
    console.log('Setlist deleted successfully')
  } catch (err) {
    console.error('Error deleting setlist:', err)
    throw err
  }
}

// Get a single setlist with all songs and full details
export const getSetlistById = async (setlistId) => {
  try {
    console.log('Fetching setlist by ID:', setlistId)
    
    const { data, error } = await supabase
      .from('setlists')
      .select(`
        *,
        setlist_songs (
          position,
          choir_songs (*)
        )
      `)
      .eq('id', setlistId)
      .single()

    if (error) throw error

    const setlist = {
      ...data,
      songs: (data.setlist_songs || [])
        .sort((a, b) => a.position - b.position)
        .map(ss => ({ ...ss.choir_songs, position: ss.position }))
    }
    
    console.log('Setlist loaded with', setlist.songs.length, 'songs')
    return setlist
    
  } catch (err) {
    console.error('Error fetching setlist:', err)
    throw err
  }
}


// ============================================================================
// PRACTICE MATERIALS API FUNCTIONS
// ============================================================================

// Get all active practice materials
export const getPracticeMaterials = async () => {
  try {
    console.log('Fetching practice materials from database...')
    
    const { data, error } = await supabase
      .from('practice_materials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching practice materials:', error)
      throw error
    }

    console.log('Successfully fetched', data?.length || 0, 'practice materials')
    return data || []
    
  } catch (err) {
    console.error('Error in getPracticeMaterials:', err)
    throw err
  }
}

// Create a new practice material
export const createPracticeMaterial = async (materialData, userId) => {
  try {
    console.log('Creating practice material:', materialData.title)
    
    const { data, error } = await supabase
      .from('practice_materials')
      .insert({
        title: materialData.title,
        description: materialData.description || null,
        text_content: materialData.textContent || null,
        audio_url: materialData.audioUrl || null,
        audio_filename: materialData.audioFilename || null,
        display_order: materialData.displayOrder || 0,
        created_by: userId,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating practice material:', error)
      throw error
    }
    
    console.log('Practice material created with ID:', data.id)
    return data
    
  } catch (err) {
    console.error('Error in createPracticeMaterial:', err)
    throw err
  }
}

// Update an existing practice material
export const updatePracticeMaterial = async (materialId, materialData) => {
  try {
    console.log('Updating practice material:', materialId)
    
    const { data, error } = await supabase
      .from('practice_materials')
      .update({
        title: materialData.title,
        description: materialData.description || null,
        text_content: materialData.textContent || null,
        audio_url: materialData.audioUrl || null,
        audio_filename: materialData.audioFilename || null,
        display_order: materialData.displayOrder || 0
      })
      .eq('id', materialId)
      .select()
      .single()

    if (error) {
      console.error('Error updating practice material:', error)
      throw error
    }
    
    console.log('Practice material updated successfully')
    return data
    
  } catch (err) {
    console.error('Error in updatePracticeMaterial:', err)
    throw err
  }
}

// Soft delete a practice material (set is_active to false)
export const deletePracticeMaterial = async (materialId) => {
  try {
    console.log('Deleting practice material:', materialId)
    
    const { error } = await supabase
      .from('practice_materials')
      .update({ is_active: false })
      .eq('id', materialId)

    if (error) {
      console.error('Error deleting practice material:', error)
      throw error
    }
    
    console.log('Practice material deleted successfully')
    
  } catch (err) {
    console.error('Error in deletePracticeMaterial:', err)
    throw err
  }
}

// Upload audio file to Supabase Storage
export const uploadPracticeAudio = async (file, materialId) => {
  try {
    console.log('Uploading audio file:', file.name)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${materialId}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('practice-audio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading audio:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data } = supabase.storage
      .from('practice-audio')
      .getPublicUrl(filePath)

    console.log('Audio uploaded successfully:', data.publicUrl)
    return {
      url: data.publicUrl,
      filename: file.name
    }
    
  } catch (err) {
    console.error('Error in uploadPracticeAudio:', err)
    throw err
  }
}

// Delete audio file from Supabase Storage
export const deletePracticeAudio = async (audioUrl) => {
  try {
    // Extract file path from URL
    const urlParts = audioUrl.split('/practice-audio/')
    if (urlParts.length < 2) {
      console.error('Invalid audio URL format')
      return
    }
    
    const filePath = urlParts[1]
    console.log('Deleting audio file:', filePath)
    
    const { error } = await supabase.storage
      .from('practice-audio')
      .remove([filePath])

    if (error) {
      console.error('Error deleting audio:', error)
      throw error
    }
    
    console.log('Audio file deleted successfully')
    
  } catch (err) {
    console.error('Error in deletePracticeAudio:', err)
    throw err
  }
}
