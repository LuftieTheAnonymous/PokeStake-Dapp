"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Rarity } from "@/lib/types"; // adjust your type imports
import { RARITY_CONFIG } from "@/lib/types";
import { NFTItem } from "@/data/mockNFTs";

interface NFTCardProps {
  nft: NFTItem;
  onClick?: () => void;
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
  uncommon: "shadow-emerald-500/30 shadow-sm",
  rare: "shadow-blue-500/40 shadow-md",
  "ultra rare": "shadow-rose-500/50 shadow-md",
};

export function NFTCard({
  nft,
  onClick,
  className,
  animated = false,
}: NFTCardProps) {
  const rarity = nft.rarity as Rarity; // map your rarity field accordingly

  return (
    <div
      key={nft.id}
      id={nft.id}
      onClick={onClick}
      className={cn(
        "w-full h-28 flex items-center gap-2 justify-between rounded-md p-2",
        "bg-gradient-to-br",
        rarityGradients[rarity],
        "border",
        rarityBorders[rarity],
        rarityGlow[rarity],
        "transition-all duration-300",
        onClick && "cursor-pointer hover:scale-105",
        animated && "animate-card-reveal",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <Image
          className="w-16 h-16 rounded object-cover"
          alt={nft.id}
          src={nft.image}
          width={64}
          height={64}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">{nft.name}</p>
          <p className="text-xs text-muted-foreground">{nft.collection}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-right">
        <p className="text-xs font-mono">ID: #{nft.id.padStart(4, "0")}</p>
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
