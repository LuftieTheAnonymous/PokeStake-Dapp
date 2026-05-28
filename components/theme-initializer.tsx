'use client';

import { useEffect } from 'react';
import { POKEMON_THEMES } from '@/lib/themes';
import { useThemeStore } from '@/lib/state-management/useTheme';

export function ThemeInitializer() {
  const selectedTheme = useThemeStore((state) => state.selectedTheme);

  useEffect(() => {
    const theme = POKEMON_THEMES[selectedTheme];
    const root = document.documentElement;

    // Apply theme colors as CSS variables
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    
    // Apply particle colors for gradient background
    root.style.setProperty('--particle-1', theme.colors.particle1);
    root.style.setProperty('--particle-2', theme.colors.particle2);
    root.style.setProperty('--particle-3', theme.colors.particle3);
    root.style.setProperty('--particle-4', theme.colors.particle4);
    root.style.setProperty('--particle-5', theme.colors.particle5);
  }, [selectedTheme]);

  return null;
}
