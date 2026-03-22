import { PokemonCard, Rarity, RARITY_CONFIG } from '@/lib/types';
import { Heart, Shield, Zap } from 'lucide-react';

const rarityGradients: Record<Rarity, string> = {
  common: "from-slate-400/30 via-slate-300/20 to-slate-400/30",
  uncommon: "from-emerald-500/30 via-green-400/20 to-emerald-500/30",
  rare: "from-blue-500/30 via-sky-400/20 to-blue-500/30",
  "ultra rare": "from-rose-500/40 via-pink-400/30 to-rose-500/40",
};

const rarityBorders: Record<Rarity
, string> = {
  common: "border-slate-500/40",
  uncommon: "border-emerald-500/50",
  rare: "border-blue-500/50",
  "ultra rare": "border-rose-500/60",
};

const rarityGlow: Record<Rarity, string> = {
  common: "",
  uncommon: "shadow-emerald-500/20 shadow-lg",
  rare: "shadow-blue-500/30 shadow-lg",
  "ultra rare": "shadow-rose-500/40 shadow-xl",
};

const rarityColors: Record<Rarity, string> = {
  common: "bg-slate-500/20 text-slate-300",
  uncommon: "bg-emerald-500/20 text-emerald-400",
  rare: "bg-blue-500/20 text-blue-400",
  "ultra rare": "bg-rose-500/20 text-rose-400",
};



function DeckCard({
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
        ${rarityGradients[card.attributes.rarity]}
        ${rarityBorders[card.attributes.rarity]}
        ${rarityGlow[card.attributes.rarity]}
        ${disabled ? "opacity-40 grayscale cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:scale-[1.03] hover:shadow-xl"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
        <span className="font-bold text-sm truncate capitalize">{card.name}</span>
        <div className="flex items-center gap-1 text-xs">
          <Heart className="h-3 w-3 text-red-400" />
          <span>{card.attributes.hp}</span>
        </div>
      </div>

      {/* Sprite */}
      <div className="relative aspect-square bg-gradient-to-b from-transparent to-background/50 p-3">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {/* Glow behind sprite */}
        <div className={`absolute inset-0 opacity-20 blur-2xl bg-gradient-to-br ${rarityGradients[card.attributes.rarity]}`} />
      </div>

      {/* Info */}
      <div className="p-3 space-y-2 bg-background/50">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${rarityColors[card.attributes.rarity]}`}>
            {card.attributes.rarity}
          </span>
          <span className="text-xs text-muted-foreground font-mono">{card.attributes.id}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1 text-xs">
            <Zap className="h-3 w-3 text-amber-400" />
            <span className="text-muted-foreground">ATK</span>
            <span className="font-medium">{card.attributes.attack
        }</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Shield className="h-3 w-3 text-blue-400" />
            <span className="text-muted-foreground">DEF</span>
            <span className="font-medium">{card.attributes.defense}</span>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground pt-1">
          <span className="font-medium text-primary">+{RARITY_CONFIG[card.attributes.rarity].dailyReward} Boost
          </span>
        </div>
      </div>

      {/* Ultra Rare shimmer */}
      {card.attributes.rarity === "ultra rare" && (
        <div className="absolute inset-0 pointer-events-none animate-shimmer" />
      )}
    </div>
  );
}

export default DeckCard