"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Swords, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePokeData from "@/hooks/usePokeData";
import { Player, PokemonBattler, PokemonCard, RARITY_CONFIG } from "@/lib/types";
import { pinata } from '@/utils/PinataConfig';
import { useQuery } from '@tanstack/react-query';
import BattleSlots from './BattleSlots';
import NftDeck from './NftDeck';
import RoomCreateDialog from "./RoomCreateDialog";
import { useGameplayLobby } from "@/lib/state-management/useGameplayLobby";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function LobbyPanel({emit}:{emit:(event:string, ...args:any[])=>void}) {
    const { walletAddress } = usePokeData();
    const [roomCode, setRoomCode] = useState("");
    const [ playerNickname, setPlayerNickname ] = useState("");
    const {pokemonBattlersSelected, addPokemon, removePokemon, clearPokemonSet} =useGameplayLobby();
    const [draggedCard, setDraggedCard] = useState<PokemonCard | null>(null);
    const MAX_SELECTED = 2;
    const { userGeneratedCards } = usePokeData();

    const { data: pokemonCards = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["NFT-deck", walletAddress],
        queryFn: async () => {
            const nftCards: PokemonCard[] = [];
            for (const pokeCard of userGeneratedCards) {
                try {
                    const response = await pinata.gateways.public.get(pokeCard.pinataId);
                    console.log(response, "response lobby");
                    if (response.data) {
                        nftCards.push(response.data as unknown as PokemonCard);
                    }
                } catch (error) {
                    console.error(`Failed to fetch card ${pokeCard.card.pinataId}`, error);
                }
            }
            return nftCards;
        },
        enabled: Boolean(walletAddress),
        retry: 5,
        refetchInterval: 100000,
        refetchOnReconnect: false,
        refetchOnMount: true,
    });

    const handleDragStart = useCallback((card: PokemonCard) => {
        setDraggedCard(card);
    }, []);

    const handleDropOnSlot = useCallback(() => {
        if (!draggedCard || pokemonBattlersSelected.includes(draggedCard) || pokemonBattlersSelected.length >= MAX_SELECTED) return;
        addPokemon(draggedCard);
     
        setDraggedCard(null);
    }, [draggedCard, pokemonBattlersSelected]);

    const removeFromSlot = (card: PokemonCard) => {
        removePokemon(card.attributes.id);
    };

    const addToSlot = (card: PokemonCard) => {
        if (pokemonBattlersSelected.length < MAX_SELECTED && !pokemonBattlersSelected.find((c) => c.attributes.id === card.attributes.id)) {
            addPokemon(card);
        }
    };

    const availableCards = useMemo(() => {
        return pokemonCards.filter((c) => !pokemonBattlersSelected.find((pc) => pc.attributes.id === c.attributes.id));
    }, [pokemonCards, pokemonBattlersSelected]);

    const canBattle = pokemonBattlersSelected.length === MAX_SELECTED;

  useEffect(() => {
   if(walletAddress){  
    clearPokemonSet();
    refetch();
}
  }, [walletAddress]);

const joinBattleRoom = ()=>{
const convertedSelectedPokemon:PokemonBattler[] = pokemonBattlersSelected.map((card)=> ({
        pokemonId: card.attributes.id,
        pokedexIndex: card.attributes.pokedexIndex,
        rarityLevel: RARITY_CONFIG[card.attributes.rarity].dailyReward,
        hp: card.attributes.hp,
        maxHp: card.attributes.hp,
        attack: card.attributes.attack,
        defense: card.attributes.defense,
        sprites:{front: card.attributes.sprites[0], back: card.attributes.sprites[1]},
        name: card.name,
        cries: card.attributes.cries
      })) as unknown as PokemonBattler[];

    let participantDetails:Player={
        currentPokemon: convertedSelectedPokemon[0],
        pokemonDeck: convertedSelectedPokemon,
        playerNickname
    };

    emit('join-battle-room', roomCode, participantDetails);
}


    return (
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-10 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                    <Swords className="w-4 h-4" /> Battle Lobby
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Choose Your Fighters</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Select up to {MAX_SELECTED} Pokémon NFTs for battle, then join or create a room.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
                <div className="glow-box bg-card border border-border rounded-xl p-5 w-full max-w-sm">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Join a Room</h3>
                    <div className="flex flex-col mb-4 gap-2">
                        <Label htmlFor="player-nickname">Player Nickname</Label>
                        <Input
                            type="text"
                            id="player-nickname"
                            value={playerNickname}
                            onChange={(e) => setPlayerNickname(e.target.value.toUpperCase())}
                            placeholder="Enter your nickname..."
                            maxLength={20}
                            className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            placeholder="ROOM CODE"
                            maxLength={6}
                            className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <Button onClick={joinBattleRoom}  disabled={!canBattle || roomCode.length < 4} className="gap-2">
                            <LogIn className="w-4 h-4" /> Join
                        </Button>
                    </div>
                </div>

                <div className="glow-box bg-card border border-border rounded-xl p-5 w-full sm:w-80">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Create a Room</h3>
                    <p className="text-xs text-muted-foreground mt-2">You'll get a code to share with your opponent.</p>
                   <RoomCreateDialog emit={emit} pokemonBattlersSelected={pokemonBattlersSelected} isPokemonBattleReady={canBattle} />
                </div>
            </div>

            <BattleSlots
                handleDropOnSlot={handleDropOnSlot}
                removeFromSlot={removeFromSlot}
                selectedCards={pokemonBattlersSelected}
                MAX_SELECTED={MAX_SELECTED}
            />

            <NftDeck
                addToSlot={addToSlot}
                handleDragStart={handleDragStart}
                selectedCards={pokemonBattlersSelected}
                pokeCards={availableCards}
            />
        </div>
    );
}

export default LobbyPanel;
