"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { PokemonCard } from "@/components/pokemon-card";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";
import { RARITY_CONFIG } from "@/lib/types";
import type { Rarity } from "@/lib/types";
import { 
  ImageIcon, 
  Ghost, 
  Filter,
  Sparkles,
  Grid3X3,
  LayoutGrid,
  SortAsc,
  Lock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FilterRarity = Rarity | "all";
type SortOption = "newest" | "rarity" | "pokedex" | "name";

export default function GalleryPage() {
  const { 
    ownedCards, 
    stakedCards,
    walletConnected,
    connectWallet 
  } = useGameStore();

  const [filterRarity, setFilterRarity] = useState<FilterRarity>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showStaked, setShowStaked] = useState(true);
  const [gridSize, setGridSize] = useState<"small" | "large">("large");

  // Combine owned and staked cards
  const allCards = useMemo(() => {
    const cards = [
      ...ownedCards.map((card) => ({ card, isStaked: false })),
      ...(showStaked ? stakedCards.map((s) => ({ card: s.card, isStaked: true })) : []),
    ];

    // Filter by rarity
    const filtered = filterRarity === "all" 
      ? cards 
      : cards.filter((c) => c.card.rarity === filterRarity);

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.card.id.localeCompare(a.card.id);
        case "rarity": {
          const rarityOrder: Rarity[] = ["legendary", "epic", "rare", "uncommon", "common"];
          return rarityOrder.indexOf(a.card.rarity) - rarityOrder.indexOf(b.card.rarity);
        }
        case "pokedex":
          return a.card.pokedexIndex - b.card.pokedexIndex;
        case "name":
          return a.card.name.localeCompare(b.card.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [ownedCards, stakedCards, filterRarity, sortBy, showStaked]);

  // Stats
  const stats = useMemo(() => {
    const all = [...ownedCards, ...stakedCards.map((s) => s.card)];
    const byRarity: Record<Rarity, number> = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };
    all.forEach((card) => {
      byRarity[card.rarity]++;
    });
    return {
      total: all.length,
      owned: ownedCards.length,
      staked: stakedCards.length,
      byRarity,
    };
  }, [ownedCards, stakedCards]);

  return (
    <div className="min-h-screen relative">
      <GradientBackground />
      <Navigation />
      
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30">
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm font-medium">NFT Gallery</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Your Collection</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              View all your Pokemon card NFTs in one place
            </p>
          </div>

          {!walletConnected ? (
            /* Connect Wallet Prompt */
            <div className="max-w-md mx-auto text-center space-y-6 py-16">
              <div className="inline-flex p-6 rounded-full bg-secondary/50 border border-border">
                <Ghost className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
                <p className="text-muted-foreground">
                  Connect your wallet to view your collection
                </p>
              </div>
              <Button size="lg" onClick={connectWallet} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg">
                Connect Wallet
              </Button>
            </div>
          ) : stats.total === 0 ? (
            /* Empty State */
            <div className="max-w-md mx-auto text-center space-y-6 py-16">
              <div className="inline-flex p-6 rounded-full bg-secondary/50 border border-border">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">No Cards Yet</h2>
                <p className="text-muted-foreground">
                  Start drawing cards to build your collection
                </p>
              </div>
              <Link href="/draw">
                <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Draw Your First Card
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Collection Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Cards</div>
                </div>
                <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm text-center">
                  <div className="text-2xl font-bold text-primary">{stats.owned}</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
                <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm text-center">
                  <div className="text-2xl font-bold text-accent">{stats.staked}</div>
                  <div className="text-sm text-muted-foreground">Staked</div>
                </div>
                <div className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-1">
                    {(Object.entries(stats.byRarity) as [Rarity, number][]).map(([rarity, count]) => (
                      <div
                        key={rarity}
                        className="flex flex-col items-center"
                        title={`${rarity}: ${count}`}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: RARITY_CONFIG[rarity].color }}
                        />
                        <span className="text-xs font-mono mt-1">{count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground text-center mt-1">By Rarity</div>
                </div>
              </div>

              {/* Filters & Controls */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-card/30 border border-border/50">
                {/* Rarity Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <button
                    onClick={() => setFilterRarity("all")}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-all",
                      filterRarity === "all"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    All
                  </button>
                  {(Object.keys(RARITY_CONFIG) as Rarity[]).map((rarity) => (
                    <button
                      key={rarity}
                      onClick={() => setFilterRarity(rarity)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm capitalize transition-all flex items-center gap-1",
                        filterRarity === rarity
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: RARITY_CONFIG[rarity].color }}
                      />
                      {rarity}
                    </button>
                  ))}
                </div>

                {/* Sort & View Options */}
                <div className="flex items-center gap-4">
                  {/* Show Staked Toggle */}
                  <button
                    onClick={() => setShowStaked(!showStaked)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                      showStaked
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Lock className="h-3 w-3" />
                    Staked
                  </button>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="newest">Newest</option>
                      <option value="rarity">Rarity</option>
                      <option value="pokedex">Pokedex</option>
                      <option value="name">Name</option>
                    </select>
                  </div>

                  {/* Grid Size */}
                  <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                    <button
                      onClick={() => setGridSize("large")}
                      className={cn(
                        "p-1.5 rounded",
                        gridSize === "large" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setGridSize("small")}
                      className={cn(
                        "p-1.5 rounded",
                        gridSize === "small" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards Grid */}
              {allCards.length === 0 ? (
                <div className="text-center py-16">
                  <Ghost className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No cards match your filters</p>
                </div>
              ) : (
                <div
                  className={cn(
                    "grid gap-4",
                    gridSize === "large"
                      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                      : "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                  )}
                >
                  {allCards.map(({ card, isStaked }) => (
                    <div key={card.id} className="relative">
                      <PokemonCard 
                        card={card} 
                        showStats={gridSize === "large"}
                        isStaked={isStaked}
                      />
                      {isStaked && (
                        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-accent/90 text-accent-foreground">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
