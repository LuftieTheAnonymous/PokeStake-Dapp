"use client";

import { POKEMON_THEMES, type PokemonTheme } from "@/lib/themes";
import { Check } from "lucide-react";

interface ThemeSelectorProps {
  selectedTheme: PokemonTheme;
  onThemeChange: (theme: PokemonTheme) => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-6">Choose Your Theme</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(Object.keys(POKEMON_THEMES) as PokemonTheme[]).map((themeKey) => {
          const theme = POKEMON_THEMES[themeKey];
          const isSelected = selectedTheme === themeKey;

          return (
            <button
              key={themeKey}
              onClick={() => onThemeChange(themeKey)}
              className={`relative rounded-xl p-4 border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 ring-2 ring-primary'
                  : 'border-border/50 bg-card/30 hover:border-primary/50'
              }`}
            >
              <div className="space-y-3">
                <div className="text-3xl">{theme.pokemon}</div>
                <div>
                  <h4 className="font-bold text-sm">{theme.label}</h4>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-primary">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
