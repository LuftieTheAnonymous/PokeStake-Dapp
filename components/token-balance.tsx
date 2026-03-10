"use client";

import { cn } from "@/lib/utils";

import Image from "next/image";

import SnorlieCoin from "@/public/snorlie.png"

interface TokenBalanceProps {
  amount: bigint;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

export function PokeCoinIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer gold ring */}
      <circle cx="50" cy="50" r="48" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="2" />
      
      {/* Inner circle */}
      <circle cx="50" cy="50" r="40" fill="url(#innerGold)" />
      
      {/* Pokemon ball design */}
      <path d="M10 50 H90" stroke="#8B4513" strokeWidth="3" />
      
      {/* Top half - red */}
      <path
        d="M50 10 A40 40 0 0 1 90 50 H10 A40 40 0 0 1 50 10"
        fill="url(#redGradient)"
      />
      
      {/* Bottom half - white/cream */}
      <path
        d="M50 90 A40 40 0 0 1 10 50 H90 A40 40 0 0 1 50 90"
        fill="url(#whiteGradient)"
      />
      
      {/* Center button outer */}
      <circle cx="50" cy="50" r="15" fill="#333" stroke="#222" strokeWidth="2" />
      
      {/* Center button inner */}
      <circle cx="50" cy="50" r="10" fill="url(#buttonGradient)" />
      
      {/* Shine effect */}
      <ellipse cx="35" cy="30" rx="12" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-20 35 30)" />
      
      {/* Definitions */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        
        <linearGradient id="innerGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEC8B" />
          <stop offset="100%" stopColor="#DAA520" />
        </linearGradient>
        
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF4444" />
          <stop offset="100%" stopColor="#CC0000" />
        </linearGradient>
        
        <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
        
        <radialGradient id="buttonGradient" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CCCCCC" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function TokenBalance({
  amount,
  size = "md",
  showLabel = true,
  className,
  animated = false,
}: TokenBalanceProps) {
  const sizeClasses = {
    sm: "text-sm gap-1.5",
    md: "text-base gap-2",
    lg: "text-xl gap-2.5",
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
  };

  return (
    <div
      className={cn(
        "flex items-center font-mono font-medium",
        sizeClasses[size],
        animated && "animate-pulse",
        className
      )}
    >
      <Image src={SnorlieCoin} className="w-8 h-8" width={iconSizes[size]} height={iconSizes[size]} alt="Snorlie-Coin" />
      <span>{Number(amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
      {showLabel && <span className="text-muted-foreground">$SNORLIE</span>}
    </div>
  );
}
