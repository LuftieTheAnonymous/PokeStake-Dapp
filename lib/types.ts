export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

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
  apy: number;
  chance: number;
  borderClass: string;
}> = {
  common: { 
    color: "#9ca3af", 
    dailyReward: 10, 
    apy: 5,
    chance: 50,
    borderClass: "border-gray-400"
  },
  uncommon: { 
    color: "#22c55e", 
    dailyReward: 25, 
    apy: 12,
    chance: 25,
    borderClass: "border-green-500"
  },
  rare: { 
    color: "#3b82f6", 
    dailyReward: 50, 
    apy: 25,
    chance: 15,
    borderClass: "border-blue-500"
  },
  epic: { 
    color: "#f43f5e", 
    dailyReward: 100, 
    apy: 50,
    chance: 8,
    borderClass: "border-rose-500"
  },
  legendary: { 
    color: "#f59e0b", 
    dailyReward: 250, 
    apy: 100,
    chance: 2,
    borderClass: "border-amber-500"
  },
};

