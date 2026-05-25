'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { useThemeInitializer } from '@/hooks/use-theme-colors';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useThemeInitializer();
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
