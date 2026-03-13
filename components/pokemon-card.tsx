"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PokemonCard as PokemonCardType, Rarity } from "@/lib/types";
import { RARITY_CONFIG } from "@/lib/types";
import { Zap, Shield, Heart } from "lucide-react";
import { useRef } from "react";

interface PokemonCardProps {
  card: PokemonCardType;
  onClick?: () => void;
  showStats?: boolean;
  isStaked?: boolean;
  className?: string;
  animated?: boolean;
}

const rarityGradients: Record<Rarity, string> = {
  common: "from-slate-400/30 via-slate-300/20 to-slate-400/30",
  uncommon: "from-emerald-500/30 via-green-400/20 to-emerald-500/30",
  rare: "from-blue-500/30 via-sky-400/20 to-blue-500/30",
  "ultra rare": "from-rose-500/40 via-pink-400/30 to-rose-500/40"
};

const rarityBorders: Record<Rarity, string> = {
  common: "border-slate-400",
  uncommon: "border-emerald-500",
  rare: "border-blue-500",
  "ultra rare": "border-rose-500",
};

const rarityGlow: Record<Rarity, string> = {
  common: "shadow-slate-500/20",
  uncommon: "shadow-emerald-500/30 shadow-lg",
  rare: "shadow-blue-500/40 shadow-lg",
  "ultra rare": "shadow-rose-500/50 shadow-xl",
};

export function PokeCard({
  card,
  onClick,
  showStats = true,
  isStaked = false,
  className,
  animated = false,
}: PokemonCardProps) {
  const audioReference = useRef<HTMLAudioElement>(null);

  const triggerCry=()=>{
    if(audioReference.current){
      if(audioReference.current.currentTime > 0){
        audioReference.current.currentTime = 0;
      }

      audioReference.current.play();
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group rounded-xl border-2 overflow-hidden transition-all duration-300",
        "bg-gradient-to-br bg-card",
        rarityGradients[card.attributes.rarity],
        rarityBorders[card.attributes.rarity],
        rarityGlow[card.attributes.rarity],
        onClick && "cursor-pointer hover:scale-105 hover:shadow-xl",
        isStaked && "opacity-75 grayscale-[30%]",
        animated && "animate-card-reveal",
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/30">
        <span className="font-bold text-sm truncate">{card.name.replace(/^./, char => char.toUpperCase())}</span>
        <div className="flex items-center gap-1 text-xs">
          <Heart className="h-3 w-3 text-red-400" />
          <span>{card.attributes.hp}</span>
        </div>
      </div>

      {/* Card Image */}
      <div onClick={triggerCry} className="relative aspect-square bg-gradient-to-b from-transparent to-background/50 p-4">
        <Image
          src={card.image}
          alt={card.name}
          fill
          className="object-contain p-2 drop-shadow-2xl"
          unoptimized
        />
        {card.attributes.cries && card.attributes.cries.latest && <audio ref={audioReference} src={card.attributes.cries.latest} />}
        {/* Glow effect */}
        <div
          className="absolute inset-0 opacity-30 blur-2xl"
          style={{ backgroundColor: RARITY_CONFIG[card.attributes.rarity].color }}
        />
      </div>

      {/* Card Info */}
      <div className="p-3 space-y-2 bg-background/50">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
            style={{
              backgroundColor: `${RARITY_CONFIG[card.attributes.rarity].color}20`,
              color: RARITY_CONFIG[card.attributes.rarity].color,
            }}
          >
            {card.attributes.rarity}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            #{card.attributes.pokedexIndex.toString().padStart(3, "0")}
          </span>
        </div>

        {showStats && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-1 text-xs">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-muted-foreground">ATK</span>
              <span className="font-medium">{card.attributes.attack}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Shield className="h-3 w-3 text-blue-400" />
              <span className="text-muted-foreground">DEF</span>
              <span className="font-medium">{card.attributes.defense}</span>
            </div>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground pt-1">
          <span className="font-medium text-primary">
            +{RARITY_CONFIG[card.attributes.rarity].dailyReward} $PKMN/day
          </span>
        </div>
      </div>

      {/* Staked Overlay */}
      {isStaked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/50">
            Staked
          </span>
        </div>
      )}

      {/* Legendary Shimmer */}
      {card.attributes.rarity === 'ultra rare' && (
        <div className="absolute inset-0 pointer-events-none animate-shimmer" />
      )}
    </div>
  );
}
