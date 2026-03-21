"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import {redirect} from "next/navigation";
import { Swords, Plus, LogIn, GripVertical, Shield, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import usePokeData from "@/hooks/usePokeData";
import useSocketIo from "@/hooks/useSocketIo";

interface PokemonCard {
  id: number;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  rarity: "Common" | "Uncommon" | "Rare" | "Ultra Rare";
  tokenId: string;
  pokedexId: number;
}

const MOCK_DECK: PokemonCard[] = [
  { id: 1, name: "Charizard", type: "fire", hp: 120, attack: 84, defense: 65, rarity: "Rare", tokenId: "#006", pokedexId: 6 },
  { id: 2, name: "Blastoise", type: "water", hp: 118, attack: 79, defense: 83, rarity: "Rare", tokenId: "#009", pokedexId: 9 },
  { id: 3, name: "Venusaur", type: "grass", hp: 122, attack: 82, defense: 80, rarity: "Rare", tokenId: "#003", pokedexId: 3 },
  { id: 4, name: "Pikachu", type: "electric", hp: 55, attack: 55, defense: 40, rarity: "Common", tokenId: "#025", pokedexId: 25 },
  { id: 5, name: "Gengar", type: "ghost", hp: 85, attack: 95, defense: 45, rarity: "Uncommon", tokenId: "#094", pokedexId: 94 },
  { id: 6, name: "Dragonite", type: "dragon", hp: 134, attack: 91, defense: 95, rarity: "Ultra Rare", tokenId: "#149", pokedexId: 149 },
  { id: 7, name: "Snorlax", type: "normal", hp: 160, attack: 65, defense: 110, rarity: "Uncommon", tokenId: "#143", pokedexId: 143 },
  { id: 8, name: "Alakazam", type: "psychic", hp: 75, attack: 50, defense: 45, rarity: "Uncommon", tokenId: "#065", pokedexId: 65 },
];

const rarityGradients: Record<string, string> = {
  Common: "from-slate-400/30 via-slate-300/20 to-slate-400/30",
  Uncommon: "from-emerald-500/30 via-green-400/20 to-emerald-500/30",
  Rare: "from-blue-500/30 via-sky-400/20 to-blue-500/30",
  "Ultra Rare": "from-rose-500/40 via-pink-400/30 to-rose-500/40",
};

const rarityBorders: Record<string, string> = {
  Common: "border-slate-500/40",
  Uncommon: "border-emerald-500/50",
  Rare: "border-blue-500/50",
  "Ultra Rare": "border-rose-500/60",
};

const rarityGlow: Record<string, string> = {
  Common: "",
  Uncommon: "shadow-emerald-500/20 shadow-lg",
  Rare: "shadow-blue-500/30 shadow-lg",
  "Ultra Rare": "shadow-rose-500/40 shadow-xl",
};

const rarityColors: Record<string, string> = {
  Common: "bg-slate-500/20 text-slate-300",
  Uncommon: "bg-emerald-500/20 text-emerald-400",
  Rare: "bg-blue-500/20 text-blue-400",
  "Ultra Rare": "bg-rose-500/20 text-rose-400",
};

function getSpriteUrl(pokedexId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexId}.png`;
}

function NFTCard({
  card,
  onDragStart,
  onClick,
  disabled,
}: {
  card: PokemonCard;
  onDragStart: () => void;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <div
      draggable={!disabled}
      onDragStart={onDragStart}
      onClick={() => !disabled && onClick()}
      className={`group relative rounded-xl border-2 overflow-hidden transition-all duration-300
        bg-gradient-to-br bg-card
        ${rarityGradients[card.rarity]}
        ${rarityBorders[card.rarity]}
        ${rarityGlow[card.rarity]}
        ${disabled ? "opacity-40 grayscale cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:scale-[1.03] hover:shadow-xl"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
        <span className="font-bold text-sm truncate">{card.name}</span>
        <div className="flex items-center gap-1 text-xs">
          <Heart className="h-3 w-3 text-red-400" />
          <span>{card.hp}</span>
        </div>
      </div>

      {/* Sprite */}
      <div className="relative aspect-square bg-gradient-to-b from-transparent to-background/50 p-3">
        <img
          src={getSpriteUrl(card.pokedexId)}
          alt={card.name}
          className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {/* Glow behind sprite */}
        <div className={`absolute inset-0 opacity-20 blur-2xl bg-gradient-to-br ${rarityGradients[card.rarity]}`} />
      </div>

      {/* Info */}
      <div className="p-3 space-y-2 bg-background/50">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${rarityColors[card.rarity]}`}>
            {card.rarity}
          </span>
          <span className="text-xs text-muted-foreground font-mono">{card.tokenId}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1 text-xs">
            <Zap className="h-3 w-3 text-amber-400" />
            <span className="text-muted-foreground">ATK</span>
            <span className="font-medium">{card.attack}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Shield className="h-3 w-3 text-blue-400" />
            <span className="text-muted-foreground">DEF</span>
            <span className="font-medium">{card.defense}</span>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground pt-1">
          <span className="font-medium text-primary">+1 $PKMN/day</span>
        </div>
      </div>

      {/* Ultra Rare shimmer */}
      {card.rarity === "Ultra Rare" && (
        <div className="absolute inset-0 pointer-events-none animate-shimmer" />
      )}
    </div>
  );
}

export default function Lobby() {
  const [roomCode, setRoomCode] = useState("");
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [draggedCard, setDraggedCard] = useState<number | null>(null);

  const MAX_SELECTED = 6;

  const handleDragStart = useCallback((id: number) => {
    setDraggedCard(id);
  }, []);

  const handleDropOnSlot = useCallback(() => {
    if (draggedCard === null) return;
    if (selectedCards.includes(draggedCard)) return;
    if (selectedCards.length >= MAX_SELECTED) return;
    setSelectedCards((prev) => [...prev, draggedCard]);
    setDraggedCard(null);
  }, [draggedCard, selectedCards]);

  const removeFromSlot = (id: number) => {
    setSelectedCards((prev) => prev.filter((c) => c !== id));
  };

  const addToSlot = (id: number) => {
    if (selectedCards.length < MAX_SELECTED && !selectedCards.includes(id)) {
      setSelectedCards((prev) => [...prev, id]);
    }
  };

  const availableCards = MOCK_DECK.filter((c) => !selectedCards.includes(c.id));
  const selectedPokemon = selectedCards.map((id) => MOCK_DECK.find((c) => c.id === id)!);
  const canBattle = selectedCards.length > 0;



  return (
    <div className=" min-h-screen text-foreground">
<GradientBackground />
      <Navigation />

      {/* Floating blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 animate-blob" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent/5 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pokemon-yellow/5 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Swords className="w-4 h-4" /> Battle Lobby
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Choose Your Fighters</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select up to {MAX_SELECTED} Pokémon NFTs for battle, then join or create a room.
          </p>
        </div>

        {/* Room Controls */}
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
              <Button
                onClick={() => canBattle && roomCode.length >= 4 && joinRoom(roomCode)}
                disabled={!canBattle || roomCode.length < 4}
                className="gap-2"
              >
                <LogIn className="w-4 h-4" /> Join
              </Button>
            </div>
          </div>

          <div className="glow-box bg-card border border-border rounded-xl p-5 w-full sm:w-80">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Create a Room</h3>
            <Button
              onClick={() => leaveRoom(roomCode)}
              className="w-full gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" /> Leave Room
            </Button>
            <p className="text-xs text-muted-foreground mt-2">You'll get a code to share with your opponent.</p>
            <Button
              onClick={() => sendToRoom("213769", {msg:"Message to the room !"})}
              className="w-full gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" /> Send message to room
            </Button>
          </div>
        </div>

        {/* Battle Slots */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-lg font-semibold mb-3">Your Team ({selectedCards.length}/{MAX_SELECTED})</h2>
          <div className="flex gap-4 flex-wrap">
            {Array.from({ length: MAX_SELECTED }).map((_, i) => {
              const card = selectedPokemon[i];
              return (
                <div
                  key={i}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropOnSlot}
                  className={`w-40 h-56 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center
                    ${card
                      ? "border-primary/40 bg-card glow-box cursor-pointer"
                      : "border-border/40 bg-secondary/30 hover:border-primary/20"
                    }`}
                  onClick={() => {
                    card && removeFromSlot(card.id);
                  }}
                >
                  {card ? (
                    <>
                      <img
                        src={getSpriteUrl(card.pokedexId)}
                        alt={card.name}
                        className="w-20 h-20 object-contain drop-shadow-lg mb-2"
                      />
                      <span className="text-sm font-semibold">{card.name}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">Tap to remove</span>
                    </>
                  ) : (
                    <>
                      <GripVertical className="w-6 h-6 text-muted-foreground/40 mb-1" />
                      <span className="text-xs text-muted-foreground/60">Drop here</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* NFT Deck */}
        <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-lg font-semibold mb-3">Your NFT Deck</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {MOCK_DECK.map((card) => {
              const isSelected = selectedCards.includes(card.id);
              return (
                <NFTCard
                  key={card.id}
                  card={card}
                  onDragStart={() => handleDragStart(card.id)}
                  onClick={() => {
                    addToSlot(card.id)}}
                  disabled={isSelected}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
