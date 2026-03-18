"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PokemonCard, Rarity } from "@/lib/types";
import { RARITY_CONFIG } from "@/lib/types";

interface NFTCardProps {
  nft: PokemonCard;
  nftId: bigint;
  onClick?: () => void;
  className?: string;
  animated?: boolean;
  selected?: boolean;
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
  uncommon: "shadow-emerald-500/30 shadow-sm",
  rare: "shadow-blue-500/40 shadow-md",
  "ultra rare": "shadow-rose-500/50 shadow-md",
};

const raritySelectedGlow: Record<Rarity, string> = {
  common: "shadow-slate-500/60 shadow-lg",
  uncommon: "shadow-emerald-500/60 shadow-lg",
  rare: "shadow-blue-500/70 shadow-lg",
  "ultra rare": "shadow-rose-500/80 shadow-xl",
};

const rarityRing: Record<Rarity, string> = {
  common: "ring-slate-400",
  uncommon: "ring-emerald-500",
  rare: "ring-blue-500",
  "ultra rare": "ring-rose-500",
};

export function NFTCard({
  nft,
  onClick,
  className,
  animated = false,
  selected = false,
  nftId
}: NFTCardProps) {
  const rarity = nft.attributes.rarity as Rarity;

  return (
    <div
      key={nft.attributes.id}
      id={`${nft.attributes.id}`}
      onClick={onClick}
      className={cn(
        "relative w-full h-28 flex items-center gap-2 justify-between rounded-md p-2",
        "bg-gradient-to-br",
        rarityGradients[rarity],
        "border-2",
        rarityBorders[rarity],
        selected ? raritySelectedGlow[rarity] : rarityGlow[rarity],
        "transition-all duration-300",
        onClick && "cursor-pointer hover:scale-95",
        selected && "ring-2 ring-offset-2",
        selected && rarityRing[rarity],
        animated && "animate-card-reveal",
        className
      )}
    >
      {/* Selected Badge */}
      {selected && (
        <div
          className={cn(
            "absolute top-1 right-1 px-2 py-1 rounded-full text-xs font-semibold",
            "bg-gradient-to-r backdrop-blur-sm",
            "animate-pulse"
          )}
          style={{
            background: `linear-gradient(135deg, ${RARITY_CONFIG[rarity].color}80, ${RARITY_CONFIG[rarity].color}40)`,
            color: RARITY_CONFIG[rarity].color,
            boxShadow: `0 0 12px ${RARITY_CONFIG[rarity].color}60`,
          }}
        >
          ✓ Selected
        </div>
      )}

      <div className="flex items-center gap-1">
        <Image
          className="w-16 h-16 rounded object-cover"
          alt={`${nft.attributes.id}`}
          src={nft.image}
          width={64}
          height={64}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm capitalize font-bold">{nft.name}</p>
          <p className="text-xs text-muted-foreground">{nft.attributes.type.map((type, i) => (
            <span key={i} className="capitalize">
              {type} {i === 0 ? " / " : ""}
            </span>
          ))}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-right">
        <p className="text-xs font-mono">ID: #{`${nftId}`.padStart(4, "0")}</p>
        <p
          className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
          style={{
            backgroundColor: `${RARITY_CONFIG[rarity].color}20`,
            color: RARITY_CONFIG[rarity].color,
          }}
        >
          {rarity}
        </p>
      </div>
    </div>
  );
}
