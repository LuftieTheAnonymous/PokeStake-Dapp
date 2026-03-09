import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PokemonCard, StakedCard, Rarity } from "./types";
import { RARITY_CONFIG } from "./types";
import { th } from "date-fns/locale";

interface GameState {
  ownedCards: PokemonCard[];
  stakedCards: StakedCard[];
  pokemonCoins: number;
  walletConnected: boolean;
  walletAddress: string | null;
  
  connectWallet: () => void;
  disconnectWallet: () => void;
  drawCard: () => PokemonCard;
  stakeCard: (cardId: string) => boolean;
  unstakeCard: (cardId: string) => boolean;
  claimRewards: () => number;
  getAccruedRewards: () => number;
  getTotalAPY: () => number;
}

function generateCardId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getRandomRarity(): Rarity {
  const roll = Math.random() * 100;
  let cumulative = 0;
  
  for (const [rarity, config] of Object.entries(RARITY_CONFIG)) {
    cumulative += config.chance;
    if (roll <= cumulative) {
      return rarity as Rarity;
    }
  }
  return "common";
}

async function getRandomPokemon() {
try {
  const index = Math.floor(Math.random() * 1024);
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
  const data = await response.json();
  return {
    name: data.name,
    pokedexIndex: data.id,
    type: data.types[0].type.name,
    hp: data.stats.find((s) => s.stat.name === "hp")?.base_stat || 50,
    attack: data.stats.find((s) => s.stat.name === "attack")?.base_stat || 50,
    defense: data.stats.find((s) => s.stat.name === "defense")?.base_stat || 50,
  };
} catch (error) {
  throw new Error("Failed to fetch Pokemon data");
}
}

function generatePokemonImageUrl(pokedexIndex: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexIndex}.png`;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ownedCards: [],
      stakedCards: [],
      pokemonCoins: 100,
      walletConnected: false,
      walletAddress: null,
      
      connectWallet: () => {
        const address = `0x${Math.random().toString(16).substr(2, 40)}`;
        set({ walletConnected: true, walletAddress: address });
      },
      
      disconnectWallet: () => {
        set({ walletConnected: false, walletAddress: null });
      },
      
     drawCard: () => {
        const pokemon = getRandomPokemon().then((pokemon) => pokemon).catch((error) => {
          console.error("Error drawing card:", error);
          return null;
        });
        const rarity = getRandomRarity();
        const rarityMultiplier = {
          common: 1,
          uncommon: 1.2,
          rare: 1.5,
          epic: 2,
          legendary: 3,
        };
        
        const newCard: PokemonCard = {
          id: generateCardId(),
          name: pokemon.name,
          pokedexIndex: pokemon.pokedexIndex,
          rarity,
          imageUrl: generatePokemonImageUrl(pokemon.pokedexIndex),
          type: pokemon.type,
          hp: Math.floor(pokemon.hp * rarityMultiplier[rarity]),
          attack: Math.floor(pokemon.attack * rarityMultiplier[rarity]),
          defense: Math.floor(pokemon.defense * rarityMultiplier[rarity]),
        };
        
        set((state) => ({
          ownedCards: [...state.ownedCards, newCard],
          pokemonCoins: state.pokemonCoins - 10,
        }));
        
        return newCard;
      },
      
      stakeCard: (cardId: string) => {
        const state = get();
        const card = state.ownedCards.find((c) => c.id === cardId);
        
        if (!card) return false;
        
        const now = Date.now();
        const stakedCard: StakedCard = {
          card,
          stakedAt: now,
          unlockTime: now + 24 * 60 * 60 * 1000, // 1 day lock
          accruedTokens: 0,
        };
        
        set((state) => ({
          ownedCards: state.ownedCards.filter((c) => c.id !== cardId),
          stakedCards: [...state.stakedCards, stakedCard],
        }));
        
        return true;
      },
      
      unstakeCard: (cardId: string) => {
        const state = get();
        const stakedCard = state.stakedCards.find((s) => s.card.id === cardId);
        
        if (!stakedCard) return false;
        if (Date.now() < stakedCard.unlockTime) return false;
        
        // Calculate rewards
        const timeStaked = Date.now() - stakedCard.stakedAt;
        const daysStaked = timeStaked / (24 * 60 * 60 * 1000);
        const dailyReward = RARITY_CONFIG[stakedCard.card.rarity].dailyReward;
        const rewards = Math.floor(daysStaked * dailyReward);
        
        set((state) => ({
          stakedCards: state.stakedCards.filter((s) => s.card.id !== cardId),
          ownedCards: [...state.ownedCards, stakedCard.card],
          pokemonCoins: state.pokemonCoins + rewards,
        }));
        
        return true;
      },
      
      claimRewards: () => {
        const rewards = get().getAccruedRewards();
        set((state) => ({
          pokemonCoins: state.pokemonCoins + rewards,
          stakedCards: state.stakedCards.map((s) => ({
            ...s,
            stakedAt: Date.now(),
          })),
        }));
        return rewards;
      },
      
      getAccruedRewards: () => {
        const state = get();
        let total = 0;
        
        for (const stakedCard of state.stakedCards) {
          const timeStaked = Date.now() - stakedCard.stakedAt;
          const daysStaked = timeStaked / (24 * 60 * 60 * 1000);
          const dailyReward = RARITY_CONFIG[stakedCard.card.rarity].dailyReward;
          total += daysStaked * dailyReward;
        }
        
        return Math.floor(total);
      },
      
      getTotalAPY: () => {
        const state = get();
        if (state.stakedCards.length === 0) return 0;
        
        let totalAPY = 0;
        for (const stakedCard of state.stakedCards) {
          totalAPY += RARITY_CONFIG[stakedCard.card.rarity].apy;
        }
        
        return totalAPY / state.stakedCards.length;
      },
    }),
    {
      name: "pokemon-staking-storage",
    }
  )
);
