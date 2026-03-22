import { type Log } from "viem";

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

export type Currency = "ETH" | "SNORLIE";


export interface NFTItem {
  id: string;
  name: string;
  collection: string;
  rarity: Rarity;
  image: string;
  price: number;
  currency: Currency;
  creator: string;
  listedAt: Date;
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

export const snorliesOptions:{timeExtension:"1 day" | "1 week" | "1 month" | "1 year", amountOfTokens:bigint}[]=[
  {timeExtension:'1 day', amountOfTokens:BigInt(100e18)},
  {timeExtension:'1 week', amountOfTokens:BigInt(500e18)},
  {timeExtension:'1 month', amountOfTokens:BigInt(750e18)},
  {timeExtension:'1 year', amountOfTokens:BigInt(1000e18)}
];


export const ethOptions:{timeExtension:"1 day" | "1 week" | "1 month" | "1 year", amountOfTokens:bigint}[]=[
  {timeExtension:'1 day', amountOfTokens:BigInt(2e18)},
  {timeExtension:'1 week', amountOfTokens:BigInt(5e18)},
  {timeExtension:'1 month', amountOfTokens:BigInt(10e18)},
  {timeExtension:'1 year', amountOfTokens:BigInt(50e18)}
];


export interface BlockchainEvent extends Log {
  args:Record<string,any>
}