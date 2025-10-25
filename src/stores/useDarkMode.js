import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDarkMode = create(
  persist(
    (set) => ({
      isDark: false,
      toggleDarkMode: () => set((state) => ({ isDark: !state.isDark })),
      setDarkMode: (isDark) => set({ isDark }),
    }),
    {
      name: 'dark-mode-storage',
    }
  )
);

export default useDarkMode;