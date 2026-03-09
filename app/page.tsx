"use client";

import Link from "next/link";
import { Sparkles, Layers, ImageIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { RARITY_CONFIG } from "@/lib/types";
import { PokeCoinIcon } from "@/components/token-balance";

const features = [
  {
    icon: Sparkles,
    title: "Draw Cards",
    description: "Draw random Pokemon cards with varying rarities and rewards",
    href: "/draw",
  },
  {
    icon: Layers,
    title: "Stake & Earn",
    description: "Stake your cards to earn $PKMN tokens based on rarity",
    href: "/staking",
  },
  {
    icon: ImageIcon,
    title: "Your Gallery",
    description: "View and manage your entire NFT collection",
    href: "/gallery",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <GradientBackground />
      <Navigation />
      
      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <PokeCoinIcon size={80} className="drop-shadow-2xl" />
                <div className="absolute inset-0 blur-xl bg-amber-500/30 rounded-full" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                <span className="text-foreground">Poke</span>
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">Stake</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                The ultimate Web3 staking protocol for Pokemon cards. 
                Draw rare cards, stake to earn $PKMN, and build your collection.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/draw">
                <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg px-8 shadow-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Drawing
                </Button>
              </Link>
              <Link href="/staking">
                <Button size="lg" variant="outline" className="border-amber-500/50 hover:bg-amber-500/10 text-lg px-8">
                  View Protocol
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-4">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Explore
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Staking Rewards Table */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Staking Rewards by Rarity
            </h2>
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-border/50 bg-secondary/30 text-sm font-medium text-muted-foreground">
                <div>Rarity</div>
                <div className="text-center">Daily Reward</div>
                <div className="text-center">APY</div>
                <div className="text-center">Drop Rate</div>
              </div>
              {(Object.entries(RARITY_CONFIG) as [string, typeof RARITY_CONFIG.common][]).map(([rarity, config]) => (
                <div
                  key={rarity}
                  className="grid grid-cols-4 gap-4 p-4 border-b border-border/30 last:border-0 items-center"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="font-medium capitalize">{rarity}</span>
                  </div>
                  <div className="text-center font-mono flex items-center justify-center gap-1">
                    <PokeCoinIcon size={16} />
                    {config.dailyReward}
                  </div>
                  <div className="text-center font-mono text-primary">
                    {config.apy}%
                  </div>
                  <div className="text-center font-mono text-muted-foreground">
                    {config.chance}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PokeCoinIcon size={20} />
              <span className="text-sm">PokeStake Protocol</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A Web3 staking demo built with Next.js
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
