import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NFTItem } from "@/data/mockNFTs";
import { cn } from "@/lib/utils";
import { PokemonCard, SaleListing } from "@/lib/types";

interface ListingProps {
  nft: {saleDetails: SaleListing, card:PokemonCard};
  index?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      duration: 0.3,
    },
  },
};

const rarityGradients: Record<string, string> = {
  common: "from-slate-400/30 via-slate-300/20 to-slate-400/30",
  uncommon: "from-emerald-500/30 via-green-400/20 to-emerald-500/30",
  rare: "from-blue-500/30 via-sky-400/20 to-blue-500/30",
  legendary: "from-rose-500/40 via-pink-400/30 to-rose-500/40",
};

const rarityBorders: Record<string, string> = {
  common: "border-slate-400",
  uncommon: "border-emerald-500",
  rare: "border-blue-500",
  legendary: "border-rose-500",
};

const rarityGlow: Record<string, string> = {
  common: "shadow-slate-500/40",
  uncommon: "shadow-emerald-500/50 shadow-lg",
  rare: "shadow-blue-500/60 shadow-lg",
  legendary: "shadow-rose-500/70 shadow-lg",
};

const rarityColors: Record<string, string> = {
  common: "rgb(100, 116, 139)",
  uncommon: "rgb(16, 185, 129)",
  rare: "rgb(59, 130, 246)",
  legendary: "rgb(244, 63, 94)",
};

const getRarityClass = (rarity?: string) => {
  const key = (rarity || "common").toLowerCase();
  return {
    gradient: rarityGradients[key] || rarityGradients.common,
    border: rarityBorders[key] || rarityBorders.common,
    glow: rarityGlow[key] || rarityGlow.common,
    color: rarityColors[key] || rarityColors.common,
  };
};

const Listing = ({ nft, index = 0 }: ListingProps) => {
  const rarity = getRarityClass(nft.card.attributes.rarity);

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/marketplace/listing/${Number(nft.saleDetails.listingId)}`}
        className={cn(
          "group relative block border-2 rounded-xl bg-gradient-to-br bg-card overflow-hidden",
          "transition-all duration-300 cursor-pointer",
          "hover:shadow-lg",
          rarity.border,
          rarity.gradient,
          rarity.glow
        )}
      >
        {/* Outer glow layer */}
        <div
          className="absolute -inset-1 rounded-xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-300 pointer-events-none -z-10"
          style={{ backgroundColor: rarity.color }}
        />

        {/* Image Container */}
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={nft.card.image}
            alt={nft.card.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Multiple layered glow effects */}
          <div
            className="absolute inset-0 opacity-40 blur-3xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${rarity.color} 0%, transparent 70%)`,
            }}
          />

          <div
            className="absolute inset-1/4 opacity-30 blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${rarity.color} 0%, transparent 60%)`,
            }}
          />

          {/* Corner glow accents */}
          <div
            className="absolute top-0 right-0 w-1/3 h-1/3 opacity-40 blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at top right, ${rarity.color} 0%, transparent 70%)`,
            }}
          />

          <div
            className="absolute bottom-0 left-0 w-1/3 h-1/3 opacity-30 blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at bottom left, ${rarity.color} 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Content Section */}
        <div className="p-3 space-y-2 bg-background/60 backdrop-blur-sm border-t border-border/20">
          {/* Collection & Name */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground capitalize">{nft.card.attributes.type.join(" / ")}</p>
            <h3 className="text-sm capitalize font-semibold tracking-tight text-foreground truncate">
              {nft.card.name}
            </h3>
          </div>

          {/* Price & Currency */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-sm font-medium tabular-nums tracking-tight text-foreground">
                {(Number(nft.saleDetails.listingPrice) / Number(1e18)).toFixed(4)}
              </span>
              <Badge
                variant={!nft.saleDetails.isPriceInEth ? "default" : "secondary"}
                className={cn(
                  "text-[10px] px-1.5 py-0 h-5 font-mono",
                  !nft.saleDetails.isPriceInEth &&
                    "bg-accent text-accent-foreground"
                )}
              >
                {nft.saleDetails.isPriceInEth ? "ETH" : "SNORLIE"}
              </Badge>
            </div>
          </div>

          {/* Buy Button */}
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm py-5 mt-2 shadow-lg shadow-orange-500/40 transition-all duration-200 hover:shadow-orange-500/60"
          >
            <Coins className="h-3.5 w-3.5 mr-1.5" />
            Buy Now
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default Listing;
