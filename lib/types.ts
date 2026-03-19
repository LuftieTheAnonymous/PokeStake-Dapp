export const pokemonAmountModulator:bigint = BigInt(151);

export const rarityModulator:bigint = BigInt(4);


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
  cries: {legacy:`https://${string}.ogg` | null | undefined, latest:`https://${string}.ogg` | null | undefined}
  };
}


export interface SaleListing {
  listingOwner: `0x${string}`;
  nftId:bigint;
  listingId:bigint;
  tokenURI:string;
  listingBlockNumber:bigint;
  expiryBlock:bigint;
  listingPrice:bigint;
  isPriceInEth:boolean;
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
    chanceRate:45,
  },
  uncommon: { 
    color: "#22c55e", 
    dailyReward: 2, 
    borderClass: "border-green-500",
    chanceRate:35
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

