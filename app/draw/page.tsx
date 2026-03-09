"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { PokemonCard } from "@/components/pokemon-card";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";
import { RARITY_CONFIG } from "@/lib/types";
import type { PokemonCard as PokemonCardType } from "@/lib/types";
import { TokenBalance, PokeCoinIcon } from "@/components/token-balance";
import { Sparkles, Ghost, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

const DRAW_COST = 10;

export default function DrawPage() {
  const [drawnCard, setDrawnCard] = useState<PokemonCardType | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCard, setShowCard] = useState(false);
  
  const { drawCard, pokemonCoins, walletConnected, connectWallet } = useGameStore();

  const handleDraw = async () => {
    if (pokemonCoins < DRAW_COST) return;
    
    setIsDrawing(true);
    setShowCard(false);
    setDrawnCard(null);
    
    // Animation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newCard = drawCard();
    setDrawnCard(newCard);
    
    // Slight delay before revealing
    setTimeout(() => {
      setShowCard(true);
      setIsDrawing(false);
    }, 200);
  };

  return (
    <div className="min-h-screen relative">
      <GradientBackground />
      <Navigation />
      
      <main className="relative">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Card Gacha</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Draw Your Cards</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Spend $PKMN tokens to draw random Pokemon cards. 
              Higher rarity cards earn more staking rewards!
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
                  Connect your wallet to start drawing Pokemon cards
                </p>
              </div>
              <Button size="lg" onClick={connectWallet} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg">
                Connect Wallet
              </Button>
            </div>
          ) : (
            /* Draw Interface */
            <div className="space-y-8">
              {/* Balance & Cost */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
                  <TokenBalance amount={pokemonCoins} size="md" showLabel={true} />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  Draw Cost: 
                  <span className="flex items-center gap-1 font-mono text-foreground">
                    <PokeCoinIcon size={16} />
                    {DRAW_COST} $PKMN
                  </span>
                </div>
              </div>

              {/* Draw Area */}
              <div className="flex flex-col items-center gap-8">
                {/* Card Display */}
                <div className="relative w-64 h-96 flex items-center justify-center">
                  {isDrawing ? (
                    /* Drawing Animation */
                    <div className="relative">
                      <div className="w-48 h-64 rounded-xl border-2 border-primary/50 bg-card animate-pulse flex items-center justify-center">
                        <Ghost className="h-16 w-16 text-primary animate-bounce" />
                      </div>
                      <div className="absolute inset-0 animate-pulse-glow rounded-xl" />
                      {/* Particles */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-primary animate-float"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  ) : drawnCard && showCard ? (
                    /* Revealed Card */
                    <div className="w-48">
                      <PokemonCard card={drawnCard} animated />
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="w-48 h-64 rounded-xl border-2 border-dashed border-border bg-card/30 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                      <Ghost className="h-12 w-12" />
                      <span className="text-sm text-center px-4">
                        Click below to draw a card
                      </span>
                    </div>
                  )}
                </div>

                {/* Draw Button */}
                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleDraw}
                    disabled={isDrawing || pokemonCoins < DRAW_COST}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg px-8 py-6 disabled:opacity-50 shadow-lg"
                  >
                    {isDrawing ? (
                      <>
                        <Ghost className="h-5 w-5 mr-2 animate-spin" />
                        Drawing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Draw Card
                        <PokeCoinIcon size={18} className="ml-2" />
                        <span className="ml-1">-{DRAW_COST}</span>
                      </>
                    )}
                  </Button>

                  {pokemonCoins < DRAW_COST && !isDrawing && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Not enough $PKMN tokens
                    </div>
                  )}
                </div>

                {/* Result Message */}
                {drawnCard && showCard && (
                  <div className="text-center space-y-4 animate-fade-in">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">
                        You drew{" "}
                        <span style={{ color: RARITY_CONFIG[drawnCard.rarity].color }}>
                          {drawnCard.name}
                        </span>
                        !
                      </p>
                      <p className="text-muted-foreground">
                        <span className="capitalize" style={{ color: RARITY_CONFIG[drawnCard.rarity].color }}>
                          {drawnCard.rarity}
                        </span>
                        {" "}rarity - Earns{" "}
                        <span className="text-primary font-mono">
                          +{RARITY_CONFIG[drawnCard.rarity].dailyReward} $PKMN/day
                        </span>
                        {" "}when staked
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Link href="/staking">
                        <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                          Stake Now
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      <Link href="/gallery">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                          View Gallery
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Rarity Table */}
              <div className="mt-16 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-center mb-6">Drop Rates</h3>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.entries(RARITY_CONFIG) as [string, typeof RARITY_CONFIG.common][]).map(([rarity, config]) => (
                    <div
                      key={rarity}
                      className="text-center p-3 rounded-xl bg-card/50 border border-border/50"
                    >
                      <div
                        className="w-4 h-4 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: config.color }}
                      />
                      <div className="text-xs text-muted-foreground capitalize mb-1">{rarity}</div>
                      <div className="font-mono text-sm font-medium">{config.chance}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
