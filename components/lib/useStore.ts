import { create } from 'zustand'

interface StoreState {
  whichComponent: string
  setWhichComponent: (text: string) => void

}

export const useStore = create<StoreState>((set) => ({
  whichComponent: '',
  setWhichComponent: (text) => set(() => ({ whichComponent: text })),  
}))