// src/lib/pdf-export.js
import jsPDF from 'jspdf'

/**
 * Estimates if lyrics will fit in a single column on one page
 * @param {string} lyrics - The song lyrics
 * @returns {boolean} - True if lyrics fit in single column
 */
function willFitInSingleColumn(lyrics) {
  if (!lyrics) return true
  
  const lines = lyrics.split('\n').filter(line => line.trim())
  const avgCharsPerLine = 60 // Average characters per line
  const maxLinesPerPage = 45 // Maximum lines that fit on a page
  
  // Count actual lines accounting for wrapping
  let totalLines = 0
  lines.forEach(line => {
    const wrappedLines = Math.ceil(line.length / avgCharsPerLine)
    totalLines += Math.max(1, wrappedLines)
  })
  
  return totalLines <= maxLinesPerPage
}

/**
 * Adds text in single or two columns based on length
 * @param {jsPDF} doc - The PDF document
 * @param {string} text - The text to add
 * @param {number} startY - Starting Y position
 * @param {number} pageHeight - Height of the page
 */
function addFormattedText(doc, text, startY, pageHeight) {
  const lines = text.split('\n')
  const useSingleColumn = willFitInSingleColumn(text)
  
  if (useSingleColumn) {
    // Single column layout
    const leftMargin = 20
    const rightMargin = 20
    const maxWidth = doc.internal.pageSize.width - leftMargin - rightMargin
    
    let y = startY
    lines.forEach(line => {
      if (y > pageHeight - 20) {
        doc.addPage()
        y = 20
      }
      
      if (line.trim()) {
        const wrappedLines = doc.splitTextToSize(line, maxWidth)
        wrappedLines.forEach(wrappedLine => {
          doc.text(wrappedLine, leftMargin, y)
          y += 6
        })
      } else {
        y += 6 // Empty line spacing
      }
    })
  } else {
    // Two column layout
    const leftMargin = 20
    const columnGap = 10
    const pageWidth = doc.internal.pageSize.width
    const columnWidth = (pageWidth - leftMargin * 2 - columnGap) / 2
    
    let y = startY
    let currentColumn = 1
    
    lines.forEach(line => {
      if (y > pageHeight - 20) {
        if (currentColumn === 1) {
          // Move to second column
          currentColumn = 2
          y = startY
        } else {
          // Add new page
          doc.addPage()
          currentColumn = 1
          y = 20
        }
      }
      
      const x = currentColumn === 1 
        ? leftMargin 
        : leftMargin + columnWidth + columnGap
      
      if (line.trim()) {
        const wrappedLines = doc.splitTextToSize(line, columnWidth)
        wrappedLines.forEach(wrappedLine => {
          doc.text(wrappedLine, x, y)
          y += 6
        })
      } else {
        y += 6 // Empty line spacing
      }
    })
  }
}

/**
 * Export a setlist to PDF with songs and lyrics
 * @param {Object} setlist - The setlist object with songs
 */
export async function exportSetlistToPDF(setlist) {
  const doc = new jsPDF()
  const pageHeight = doc.internal.pageSize.height
  
  // Title Page
  doc.setFontSize(24)
  doc.setFont(undefined, 'bold')
  doc.text(setlist.name, 20, 30)
  
  doc.setFontSize(12)
  doc.setFont(undefined, 'normal')
  
  const eventDate = new Date(setlist.event_date)
  doc.text(`Event Date: ${eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 20, 45)
  
  if (setlist.venue_notes) {
    doc.text(`Venue: ${setlist.venue_notes}`, 20, 55)
  }
  
  doc.text(`Total Duration: ${setlist.total_duration_minutes} minutes`, 20, 65)
  doc.text(`Songs: ${setlist.song_count}`, 20, 75)
  
  // Table of Contents
  doc.setFontSize(16)
  doc.setFont(undefined, 'bold')
  doc.text('Setlist Order', 20, 95)
  
  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
  
  let y = 105
  setlist.songs.forEach((song, index) => {
    if (y > pageHeight - 20) {
      doc.addPage()
      y = 20
    }
    
    const duration = song.duration_minutes ? ` (${song.duration_minutes} min)` : ''
    doc.text(`${index + 1}. ${song.title} - ${song.artist}${duration}`, 25, y)
    y += 8
  })
  
  // Song Pages with Lyrics
  setlist.songs.forEach((song, index) => {
    doc.addPage()
    
    // Song Header
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    doc.text(`${index + 1}. ${song.title}`, 20, 20)
    
    doc.setFontSize(12)
    doc.setFont(undefined, 'italic')
    doc.text(song.artist, 20, 30)
    
    if (song.genre) {
      doc.setFont(undefined, 'normal')
      doc.setFontSize(10)
      doc.text(`Genre: ${song.genre}`, 20, 38)
    }
    
    // Divider line
    doc.setLineWidth(0.5)
    doc.line(20, 42, doc.internal.pageSize.width - 20, 42)
    
    // Lyrics
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    
    if (song.lyrics && song.lyrics.trim()) {
      addFormattedText(doc, song.lyrics, 50, pageHeight)
    } else {
      doc.setFont(undefined, 'italic')
      doc.text('(No lyrics available)', 20, 55)
    }
  })
  
  // Footer on each page
  const totalPages = doc.internal.pages.length - 1 // Subtract 1 for internal counter
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.text(
      `${setlist.name} - Page ${i} of ${totalPages}`,
      doc.internal.pageSize.width / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }
  
  // Save the PDF
  const filename = `${setlist.name.replace(/[^a-z0-9]/gi, '_')}_${eventDate.toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
