'use client'

import { useThemeColors, useThemeInitializer } from '@/hooks/use-theme-colors';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useThemeInitializer();
  useThemeColors();
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
