import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dbLogin, dbRegister } from '../services/localDB.js'

const useAuthStore = create(
  persist(
    (set) => ({
      user:      null,
      token:     null,
      isLoading: false,

      init: () => {
        // Nothing to do — zustand persist handles hydration from localStorage
      },

      login: async (email, password) => {
        set({ isLoading: true })
        // Simulate a tiny async delay so the UI feels real
        await new Promise(r => setTimeout(r, 300))
        const result = dbLogin(email, password)
        if (result.error) {
          set({ isLoading: false })
          return { success: false, error: result.error }
        }
        set({ user: result.user, token: result.token, isLoading: false })
        return { success: true }
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        await new Promise(r => setTimeout(r, 300))
        const result = dbRegister(name, email, password)
        if (result.error) {
          set({ isLoading: false })
          return { success: false, error: result.error }
        }
        set({ user: result.user, token: result.token, isLoading: false })
        return { success: true }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'taskflow-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
)

export default useAuthStore
