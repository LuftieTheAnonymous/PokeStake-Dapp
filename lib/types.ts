export type Rarity = "common" | "uncommon" | "rare" | "ultra rare";

export interface PokemonCard {
  id: string;
  name: string;
  pokedexIndex: number;
  rarity: Rarity;
  imageUrl: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
}

export interface StakedCard {
  card: PokemonCard;
  stakedAt: number;
  unlockTime: number;
  accruedTokens: number;
}

export const RARITY_CONFIG: Record<Rarity, { 
  color: string; 
  dailyReward: number;
  borderClass: string;
}> = {
  common: { 
    color: "#9ca3af", 
    dailyReward: 1, 
    borderClass: "border-gray-400"
  },
  uncommon: { 
    color: "#22c55e", 
    dailyReward: 2, 
    borderClass: "border-green-500"
  },
  rare: { 
    color: "#3b82f6", 
    dailyReward: 3, 
    borderClass: "border-blue-500"
  },
  "ultra rare": { 
    color: "#f43f5e", 
    dailyReward: 4, 
    borderClass: "border-rose-500"
  },
};

