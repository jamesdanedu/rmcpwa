import { create } from 'zustand'

export const useAppStore = create((set) => ({
  currentTab: 'suggest',
  isOnline: true,
  
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setOnlineStatus: (status) => set({ isOnline: status })
}))
