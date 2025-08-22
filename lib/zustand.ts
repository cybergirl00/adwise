// lib/stores/userStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userdata: null,
      setUser: (userdata) => set({ userdata }),
      clearUser: () => set({ userdata: null }),
      updateUser: (updates: any) => 
        set((state) => ({
          userdata: state.userdata ? { ...state.userdata, ...updates } : null
        })),
    }),
    {
      name: 'user-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Optional: Only persist specific fields
      partialize: (state) => ({ user: state.userdata }),
    }
  )
);