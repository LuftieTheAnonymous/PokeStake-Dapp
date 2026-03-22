"use client";

import { useState, useMemo, useCallback } from "react";
import { Swords, Plus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePokeData from "@/hooks/usePokeData";
import { PokemonCard } from "@/lib/types";
import { pinata } from '@/utils/PinataConfig';
import { useQuery } from '@tanstack/react-query';
import BattleSlots from './BattleSlots';
import NftDeck from './NftDeck';

function LobbyPanel() {
    const { walletAddress } = usePokeData();
    const [roomCode, setRoomCode] = useState("");
    const [selectedCards, setSelectedCards] = useState<PokemonCard[]>([]);
    const [draggedCard, setDraggedCard] = useState<PokemonCard | null>(null);
    const MAX_SELECTED = 6;

    const { userGeneratedCards } = usePokeData();

    const { data: pokemonCards = [], isLoading, isError } = useQuery({
        queryKey: ["NFT-deck", walletAddress],
        queryFn: async () => {
            const nftCards: PokemonCard[] = [];
            for (const pokeCard of userGeneratedCards) {
                try {
                    const response = await pinata.gateways.public.get(pokeCard.pinataId);
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
        if (!draggedCard || selectedCards.includes(draggedCard) || selectedCards.length >= MAX_SELECTED) return;

        setSelectedCards((prev) => [...prev, draggedCard]);
        setDraggedCard(null);
    }, [draggedCard, selectedCards]);

    const removeFromSlot = (card: PokemonCard) => {
        setSelectedCards((prev) => prev.filter((c) => c.attributes.id !== card.attributes.id));
    };

    const addToSlot = (card: PokemonCard) => {
        if (selectedCards.length < MAX_SELECTED && !selectedCards.includes(card)) {
            setSelectedCards((prev) => [...prev, card]);
        }
    };

    const availableCards = useMemo(() => {
        return pokemonCards.filter((c) => !selectedCards.includes(c));
    }, [pokemonCards, selectedCards]);

    const canBattle = selectedCards.length === MAX_SELECTED;

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
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            placeholder="ROOM CODE"
                            maxLength={6}
                            className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <Button disabled={!canBattle || roomCode.length < 4} className="gap-2">
                            <LogIn className="w-4 h-4" /> Join
                        </Button>
                    </div>
                </div>

                <div className="glow-box bg-card border border-border rounded-xl p-5 w-full sm:w-80">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Create a Room</h3>
                    <Button className="w-full gap-2" variant="outline">
                        <Plus className="w-4 h-4" /> Leave Room
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">You'll get a code to share with your opponent.</p>
                    <Button className="w-full gap-2" variant="outline">
                        <Plus className="w-4 h-4" /> Send message to room
                    </Button>
                </div>
            </div>

            <BattleSlots
                handleDropOnSlot={handleDropOnSlot}
                removeFromSlot={removeFromSlot}
                selectedCards={selectedCards}
                MAX_SELECTED={MAX_SELECTED}
            />

            <NftDeck
                addToSlot={addToSlot}
                handleDragStart={handleDragStart}
                selectedCards={selectedCards}
                pokeCards={availableCards}
            />
        </div>
    );
}

export default LobbyPanel;
