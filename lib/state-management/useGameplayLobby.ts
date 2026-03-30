'use client';

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import { PokemonCard } from '../types';

type BattleState = {
    pokemonBattlersSelected:PokemonCard[]
}

type Actions = {
    removePokemon:(id:number)=>void,
    addPokemon: (pokemon:PokemonCard)=>void,
    clearPokemonSet:()=>void,
    initiatePokemonSet:(array:PokemonCard[])=>void,
}

export const useGameplayLobby = create<BattleState & Actions>()(
     persist((set)=>({
    pokemonBattlersSelected:[],
    addPokemon(pokemon){
        set((state)=> {
            let newSet = [...state.pokemonBattlersSelected, pokemon]
        return  {pokemonBattlersSelected: newSet};
        
        })
    },
    removePokemon(id) {
        set((state)=> ({pokemonBattlersSelected:state.pokemonBattlersSelected.filter((pokemon)=> pokemon.attributes.id !== id)}) )
    },
    clearPokemonSet() {
        set((state)=> ({pokemonBattlersSelected:[]}))
    },
    'initiatePokemonSet':(array)=> set(()=> ({pokemonBattlersSelected: array}))
}),{
    name:'gameplay-lobby',
}
));