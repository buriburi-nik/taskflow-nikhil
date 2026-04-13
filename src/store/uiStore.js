import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUiStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    {
      name: 'taskflow-ui-storage',
    }
  )
)

export default useUiStore
