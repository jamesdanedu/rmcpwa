import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  currentTab: 'suggest',
  isOnline: true,
  
  setCurrentTab: (tab) => {
    console.log('AppStore: Setting tab from', get().currentTab, 'to', tab)
    set({ currentTab: tab })
    console.log('AppStore: Tab set to', get().currentTab)
  },
  setOnlineStatus: (status) => set({ isOnline: status })
}))
