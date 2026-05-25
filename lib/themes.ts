export type PokemonTheme = 'charizard' | 'blastoise' | 'venusaur' | 'alakazam' | 'dragonite' | 'gengar' | 'machamp' | 'golem' | 'arcanine' | 'lapras';

export interface ThemeConfig {
  name: string;
  label: string;
  description: string;
  pokemon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    gradientFrom: string;
    gradientTo: string;
    particle1: string;
    particle2: string;
    particle3: string;
    particle4: string;
    particle5: string;
  };
}

export const POKEMON_THEMES: Record<PokemonTheme, ThemeConfig> = {
  charizard: {
    name: 'charizard',
    label: 'Charizard',
    description: 'Fiery orange and red theme',
    pokemon: '🔥',
    colors: {
      primary: 'oklch(0.65 0.22 28)',
      secondary: 'oklch(0.22 0.015 28)',
      accent: 'oklch(0.72 0.18 55)',
      background: 'oklch(0.98 0.005 28)',
      foreground: 'oklch(0.18 0.01 28)',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-red-500',
      particle1: '#ef4444,#f97316',
      particle2: '#fbbf24,#f59e0b',
      particle3: '#ec4899,#f97316',
      particle4: '#f97316,#fbbf24',
      particle5: '#ef4444,#ec4899',
    },
  },
  blastoise: {
    name: 'blastoise',
    label: 'Blastoise',
    description: 'Cool blue water theme',
    pokemon: '💧',
    colors: {
      primary: 'oklch(0.55 0.2 250)',
      secondary: 'oklch(0.22 0.015 250)',
      accent: 'oklch(0.6 0.18 200)',
      background: 'oklch(0.98 0.005 250)',
      foreground: 'oklch(0.18 0.01 250)',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-500',
      particle1: '#3b82f6,#06b6d4',
      particle2: '#0ea5e9,#06b6d4',
      particle3: '#3b82f6,#0ea5e9',
      particle4: '#06b6d4,#0891b2',
      particle5: '#0ea5e9,#0369a1',
    },
  },
  venusaur: {
    name: 'venusaur',
    label: 'Venusaur',
    description: 'Fresh green nature theme',
    pokemon: '🌿',
    colors: {
      primary: 'oklch(0.62 0.2 145)',
      secondary: 'oklch(0.22 0.015 145)',
      accent: 'oklch(0.68 0.18 110)',
      background: 'oklch(0.98 0.005 145)',
      foreground: 'oklch(0.18 0.01 145)',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-emerald-500',
      particle1: '#22c55e,#84cc16',
      particle2: '#16a34a,#4ade80',
      particle3: '#65a30d,#86efac',
      particle4: '#22c55e,#10b981',
      particle5: '#4ade80,#6ee7b7',
    },
  },
  alakazam: {
    name: 'alakazam',
    label: 'Alakazam',
    description: 'Psychic purple and pink theme',
    pokemon: '🧠',
    colors: {
      primary: 'oklch(0.58 0.2 285)',
      secondary: 'oklch(0.22 0.015 285)',
      accent: 'oklch(0.65 0.2 300)',
      background: 'oklch(0.98 0.005 285)',
      foreground: 'oklch(0.18 0.01 285)',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-pink-500',
      particle1: '#a855f7,#ec4899',
      particle2: '#d946ef,#f43f5e',
      particle3: '#9333ea,#db2777',
      particle4: '#c084fc,#ec4899',
      particle5: '#a855f7,#f43f5e',
    },
  },
  dragonite: {
    name: 'dragonite',
    label: 'Dragonite',
    description: 'Dragon orange and brown theme',
    pokemon: '🐉',
    colors: {
      primary: 'oklch(0.6 0.22 40)',
      secondary: 'oklch(0.22 0.015 40)',
      accent: 'oklch(0.75 0.18 50)',
      background: 'oklch(0.98 0.005 40)',
      foreground: 'oklch(0.18 0.01 40)',
      gradientFrom: 'from-amber-600',
      gradientTo: 'to-orange-500',
      particle1: '#f59e0b,#d97706',
      particle2: '#eab308,#ca8a04',
      particle3: '#f97316,#ea580c',
      particle4: '#fbbf24,#d97706',
      particle5: '#f59e0b,#eab308',
    },
  },
  gengar: {
    name: 'gengar',
    label: 'Gengar',
    description: 'Spooky dark purple theme',
    pokemon: '👻',
    colors: {
      primary: 'oklch(0.55 0.18 270)',
      secondary: 'oklch(0.22 0.015 270)',
      accent: 'oklch(0.62 0.2 260)',
      background: 'oklch(0.98 0.005 270)',
      foreground: 'oklch(0.18 0.01 270)',
      gradientFrom: 'from-purple-700',
      gradientTo: 'to-purple-500',
      particle1: '#7c3aed,#a855f7',
      particle2: '#6d28d9,#9333ea',
      particle3: '#a855f7,#c084fc',
      particle4: '#9333ea,#a855f7',
      particle5: '#7c3aed,#d946ef',
    },
  },
  machamp: {
    name: 'machamp',
    label: 'Machamp',
    description: 'Fighting gray and brown theme',
    pokemon: '💪',
    colors: {
      primary: 'oklch(0.52 0.1 40)',
      secondary: 'oklch(0.22 0.015 40)',
      accent: 'oklch(0.72 0.18 30)',
      background: 'oklch(0.98 0.005 40)',
      foreground: 'oklch(0.18 0.01 40)',
      gradientFrom: 'from-slate-600',
      gradientTo: 'to-amber-700',
      particle1: '#64748b,#b45309',
      particle2: '#78716c,#d97706',
      particle3: '#57534e,#a16207',
      particle4: '#6b7280,#b45309',
      particle5: '#71717a,#d97706',
    },
  },
  golem: {
    name: 'golem',
    label: 'Golem',
    description: 'Rock brown and tan theme',
    pokemon: '⛰️',
    colors: {
      primary: 'oklch(0.48 0.15 45)',
      secondary: 'oklch(0.22 0.015 45)',
      accent: 'oklch(0.75 0.16 50)',
      background: 'oklch(0.98 0.005 45)',
      foreground: 'oklch(0.18 0.01 45)',
      gradientFrom: 'from-amber-900',
      gradientTo: 'to-amber-600',
      particle1: '#b45309,#92400e',
      particle2: '#d97706,#b45309',
      particle3: '#f59e0b,#d97706',
      particle4: '#a16207,#d97706',
      particle5: '#ca8a04,#b45309',
    },
  },
  arcanine: {
    name: 'arcanine',
    label: 'Arcanine',
    description: 'Fire orange and cream theme',
    pokemon: '🔥',
    colors: {
      primary: 'oklch(0.62 0.2 35)',
      secondary: 'oklch(0.22 0.015 35)',
      accent: 'oklch(0.85 0.14 60)',
      background: 'oklch(0.98 0.005 35)',
      foreground: 'oklch(0.18 0.01 35)',
      gradientFrom: 'from-orange-600',
      gradientTo: 'to-yellow-500',
      particle1: '#ea580c,#f97316',
      particle2: '#fbbf24,#eab308',
      particle3: '#f97316,#eab308',
      particle4: '#fbbf24,#ea580c',
      particle5: '#f59e0b,#eab308',
    },
  },
  lapras: {
    name: 'lapras',
    label: 'Lapras',
    description: 'Water cyan and blue theme',
    pokemon: '🌊',
    colors: {
      primary: 'oklch(0.58 0.18 260)',
      secondary: 'oklch(0.22 0.015 260)',
      accent: 'oklch(0.65 0.18 200)',
      background: 'oklch(0.98 0.005 260)',
      foreground: 'oklch(0.18 0.01 260)',
      gradientFrom: 'from-cyan-500',
      gradientTo: 'to-blue-600',
      particle1: '#06b6d4,#1e40af',
      particle2: '#0891b2,#0ea5e9',
      particle3: '#0ea5e9,#1e40af',
      particle4: '#06b6d4,#0369a1',
      particle5: '#0891b2,#1e40af',
    },
  },
};
