export const pokemonAmountModulator:bigint = BigInt(151);

export const rarityModulator:bigint = BigInt(4);

export const pokemonModulators:bigint[]=[pokemonAmountModulator, rarityModulator];


export type Rarity = "common" | "uncommon" | "rare" | "ultra rare";
export interface PokemonCard {
  name: string;
  image: string;
  description:string;
  attributes:{
  id: number;
  pokedexIndex: number;
  rarity: Rarity;
  type: string[];
  sprites:(string | null)[],
  hp: number;
  attack: number;
  defense: number;
  };
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
  chanceRate:number;
}> = {
  common: { 
    color: "#9ca3af", 
    dailyReward: 1, 
    borderClass: "border-gray-400",
    chanceRate:40,
  },
  uncommon: { 
    color: "#22c55e", 
    dailyReward: 2, 
    borderClass: "border-green-500",
    chanceRate:30
  },
  rare: { 
    color: "#3b82f6", 
    dailyReward: 3, 
    borderClass: "border-blue-500",
    chanceRate:15,
  },
  "ultra rare": { 
    color: "#f43f5e", 
    dailyReward: 4, 
    borderClass: "border-rose-500",
    chanceRate:5
  },
};

