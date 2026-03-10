'use client';

import type { PokemonCard, StakedCard, Rarity } from "./types";
import { RARITY_CONFIG } from "./types";
import { th } from "date-fns/locale";




function usePokeCard() {
 function generateCardId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}




async function getRandomPokemon(pokedexIndex:number) {
try {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexIndex + 1}`);
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


async function drawCard(pokedexIndex:number, rarityLevel:number) {
        const pokemon = await getRandomPokemon(pokedexIndex);
        const rarityMultiplier = {
          common: 1,
          uncommon: 2,
          rare: 3,
          "ultra rare": 4,
        };
      const selectedKey=Object.keys(rarityMultiplier).at(rarityLevel);

      const rarityBoost =rarityMultiplier[selectedKey as Rarity];

      const pokemonImage = generatePokemonImageUrl(pokemon.pokedexIndex);

        const newCard: PokemonCard = {
          id: generateCardId(),
          name: pokemon.name,
          pokedexIndex: pokemon.pokedexIndex,
          rarity: selectedKey as Rarity,
          imageUrl: pokemonImage,
          type: pokemon.type,
          hp: Math.floor(pokemon.hp * (rarityBoost)),
          attack: Math.floor(pokemon.attack * rarityBoost),
          defense: Math.floor(pokemon.defense * rarityBoost),
        };
      
        
        return newCard;
      }

function generatePokemonImageUrl(pokedexIndex: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexIndex}.png`;
}

return {
  drawCard,
  getRandomPokemon
}
}

export default usePokeCard