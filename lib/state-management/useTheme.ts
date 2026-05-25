import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PokemonTheme } from "@/lib/themes";

interface ThemeState {
  selectedTheme: PokemonTheme;
  setTheme: (theme: PokemonTheme) => void;
}


export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      selectedTheme: 'charizard',
      
      setTheme: (theme: PokemonTheme) => {
        set({ selectedTheme: theme });
      },
      
    }),
    {
      name: "pokemon-staking-storage",
    }
  )
);
