'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { canUserEdit } from '../../lib/permissions'
import { getPracticeMaterials } from '../../lib/api'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'
import PracticeMaterialCard from '../../features/practice/PracticeMaterialCard'
import PracticeMaterialEditor from '../../features/practice/PracticeMaterialEditor'

export default function PracticeScreen() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  
  const isEditor = user && canUserEdit(user.id)

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = async () => {
    try {
      setIsLoading(true)
      const data = await getPracticeMaterials()
      setMaterials(data || [])
    } catch (err) {
      console.error('Error loading practice materials:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateClick = () => {
    setEditingMaterial(null)
    setShowEditor(true)
  }

  const handleEditClick = (material) => {
    setEditingMaterial(material)
    setShowEditor(true)
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    setEditingMaterial(null)
    loadMaterials()
  }

  const handleCardClick = (material) => {
    setSelectedMaterial(material)
  }

  const handleCloseDetail = () => {
    setSelectedMaterial(null)
  }

  if (showEditor) {
    return (
      <PracticeMaterialEditor
        material={editingMaterial}
        onClose={handleEditorClose}
        userId={user.id}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400 text-sm">
            Loading practice materials...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          🏋️ Practice Materials
        </h2>
        <p className="text-gray-400 text-sm">
          {materials.length === 0 
            ? 'No practice materials yet' 
            : `${materials.length} practice ${materials.length === 1 ? 'material' : 'materials'} available`
          }
        </p>
      </div>

      {/* Editor Add Button */}
      {isEditor && (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleCreateClick}
        >
          ➕ Add Practice Material
        </Button>
      )}

      {/* Practice Materials List */}
      {materials.length === 0 && !isEditor ? (
        <div className="glass rounded-xl p-8 text-center border border-white/5">
          <div className="text-4xl mb-4">🎵</div>
          <p className="text-gray-400">
            No practice materials available yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back soon for practice tracks and learning materials!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {materials.map((material) => (
            <PracticeMaterialCard
              key={material.id}
              material={material}
              isEditor={isEditor}
              onEdit={() => handleEditClick(material)}
              onClick={() => handleCardClick(material)}
            />
          ))}
        </div>
      )}

      {/* Info Box */}
      {materials.length > 0 && (
        <div className="glass rounded-xl p-4 border border-white/5">
          <h4 className="text-yellow-400 font-semibold mb-2">
            💡 How to Use Practice Materials
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p>• Tap any card to view text and play audio</p>
            <p>• Audio files play directly in your browser</p>
            <p>• Practice materials are updated regularly</p>
          </div>
        </div>
      )}
    </div>
  )
}
