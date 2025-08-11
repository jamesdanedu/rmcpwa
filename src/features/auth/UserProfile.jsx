'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { formatDistanceToNow } from 'date-fns'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

export default function UserProfile({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    onClose()
  }

  const sessionCreated = user.created_at ? new Date(user.created_at) : new Date()
  const joinedAgo = formatDistanceToNow(sessionCreated, { addSuffix: true })

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title="User Profile"
        size="sm"
      >
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 gradient-roscommon rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {user.name}
            </h3>
            <p className="text-gray-400 text-sm">
              {user.phone_number}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-3 text-center border border-white/5">
              <div className="text-yellow-400 font-bold text-lg">
                {user.role === 'admin' ? 'Admin' : 'Member'}
              </div>
              <div className="text-gray-400 text-xs">
                Role
              </div>
            </div>
            
            <div className="glass rounded-xl p-3 text-center border border-white/5">
              <div className="text-yellow-400 font-bold text-lg">
                {joinedAgo}
              </div>
              <div className="text-gray-400 text-xs">
                Joined
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>

      {/* Logout Confirmation */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Sign Out"
        size="sm"
      >
        <div className="p-6 text-center space-y-4">
          <div className="text-4xl mb-4">👋</div>
          <h3 className="text-lg font-semibold text-white">
            Are you sure you want to sign out?
          </h3>
          <p className="text-gray-400 text-sm">
            You'll need to enter your name and phone number again to sign back in.
          </p>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              className="flex-1"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
