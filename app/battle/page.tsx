'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PokemonBattler {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  pokedexId: number;
  isPlayer: boolean;
}

function getFrontSprite(pokedexId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexId}.png`;
}
function getBackSprite(pokedexId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokedexId}.png`;
}

const DEFAULT_PLAYER_TEAM: PokemonBattler[] = [
  { name: "Pikachu", level: 20, hp: 55, maxHp: 55, attack: 55, defense: 40, pokedexId: 25, isPlayer: true },
];

const OPPONENT_TEAM: PokemonBattler[] = [
  { name: "Pidgey", level: 17, hp: 40, maxHp: 40, attack: 45, defense: 40, pokedexId: 16, isPlayer: false },
  { name: "Rattata", level: 15, hp: 30, maxHp: 30, attack: 56, defense: 35, pokedexId: 19, isPlayer: false },
  { name: "Zubat", level: 16, hp: 40, maxHp: 40, attack: 45, defense: 35, pokedexId: 41, isPlayer: false },
];

function HpBar({ current, max, showNumbers }: { current: number; max: number; showNumbers?: boolean }) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? "bg-pokemon-green" : pct > 20 ? "bg-pokemon-yellow" : "bg-pokemon-red";
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-pokemon-yellow tracking-wider">HP</span>
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      {showNumbers && (
        <p className="text-right text-xs font-mono text-foreground mt-0.5">
          {Math.max(0, current)} / {max}
        </p>
      )}
    </div>
  );
}

function PokemonInfoBox({ pokemon, side }: { pokemon: PokemonBattler; side: "player" | "opponent" }) {
  const isPlayer = side === "player";
  return (
    <div className="glow-box bg-card/90 border border-border rounded-xl px-4 py-3 w-56 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-sm">{pokemon.name}</span>
        <span className="text-xs text-muted-foreground font-mono">Lv{pokemon.level}</span>
      </div>
      <HpBar current={pokemon.hp} max={pokemon.maxHp} showNumbers={isPlayer} />
    </div>
  );
}

export default function Battle() {
  const navigate = useRouter();
  const [searchParams] = useSearchParams();

  // Build player team from URL params or use default
  const [playerTeam, setPlayerTeam] = useState<PokemonBattler[]>(() => {
    const teamParam = searchParams[0];
    if (teamParam) {
      try {
        return JSON.parse(decodeURIComponent(teamParam));
      } catch { return DEFAULT_PLAYER_TEAM; }
    }
    return DEFAULT_PLAYER_TEAM;
  });

  const [opponentTeam, setOpponentTeam] = useState<PokemonBattler[]>(OPPONENT_TEAM);
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);
  const [activeOpponentIdx, setActiveOpponentIdx] = useState(0);
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSwapMenu, setShowSwapMenu] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [opponentShake, setOpponentShake] = useState(false);

  const player = playerTeam[activePlayerIdx];
  const opponent = opponentTeam[activeOpponentIdx];

  useEffect(() => {
    if (player) setMessage(`What will ${player.name} do?`);
  }, [activePlayerIdx, player]);

  const allOpponentsDefeated = opponentTeam.every((p) => p.hp <= 0);
  const allPlayersDefeated = playerTeam.every((p) => p.hp <= 0);

  useEffect(() => {
    if (allOpponentsDefeated && !showVictory) setShowVictory(true);
    if (allPlayersDefeated && !showDefeat) setShowDefeat(true);
  }, [allOpponentsDefeated, allPlayersDefeated, showVictory, showDefeat]);

  const calcDamage = (attacker: PokemonBattler, defender: PokemonBattler) => {
    const base = Math.floor(((2 * attacker.level / 5 + 2) * attacker.attack / defender.defense) / 10) + 2;
    const variance = 0.85 + Math.random() * 0.15;
    return Math.max(1, Math.floor(base * variance));
  };

  const advanceOpponent = () => {
    const nextAlive = opponentTeam.findIndex((p, i) => i > activeOpponentIdx && p.hp > 0);
    if (nextAlive !== -1) {
      setActiveOpponentIdx(nextAlive);
      setMessage(`Opponent sent out ${opponentTeam[nextAlive].name}!`);
    } else {
      const anyAlive = opponentTeam.findIndex((p) => p.hp > 0);
      if (anyAlive !== -1) {
        setActiveOpponentIdx(anyAlive);
        setMessage(`Opponent sent out ${opponentTeam[anyAlive].name}!`);
      }
    }
  };

  const handleFight = () => {
    if (isAnimating || !player || !opponent || player.hp <= 0 || opponent.hp <= 0) return;
    setIsAnimating(true);

    const playerDmg = calcDamage(player, opponent);
    setMessage(`${player.name} used Thunderbolt!`);
    setOpponentShake(true);

    setTimeout(() => {
      setOpponentShake(false);
      const newOpHp = Math.max(0, opponent.hp - playerDmg);
      setOpponentTeam((prev) => prev.map((p, i) => i === activeOpponentIdx ? { ...p, hp: newOpHp } : p));

      if (newOpHp <= 0) {
        setMessage(`${opponent.name} fainted!`);
        setTimeout(() => {
          advanceOpponent();
          setIsAnimating(false);
        }, 1200);
        return;
      }

      setTimeout(() => {
        const opDmg = calcDamage(opponent, player);
        setMessage(`${opponent.name} used Tackle!`);
        setPlayerShake(true);

        setTimeout(() => {
          setPlayerShake(false);
          const newPlHp = Math.max(0, player.hp - opDmg);
          setPlayerTeam((prev) => prev.map((p, i) => i === activePlayerIdx ? { ...p, hp: newPlHp } : p));

          if (newPlHp <= 0) {
            setMessage(`${player.name} fainted!`);
            setTimeout(() => {
              const nextAlive = playerTeam.findIndex((p, i) => i !== activePlayerIdx && p.hp > 0);
              if (nextAlive !== -1) {
                setShowSwapMenu(true);
              }
              setIsAnimating(false);
            }, 1000);
          } else {
            setTimeout(() => {
              setMessage(`What will ${player.name} do?`);
              setIsAnimating(false);
            }, 500);
          }
        }, 400);
      }, 800);
    }, 600);
  };

  const handleSwap = (idx: number) => {
    if (playerTeam[idx].hp <= 0 || idx === activePlayerIdx) return;
    setShowSwapMenu(false);
    setMessage(`Go, ${playerTeam[idx].name}!`);
    setActivePlayerIdx(idx);
    setTimeout(() => {
      setMessage(`What will ${playerTeam[idx].name} do?`);
      setIsAnimating(false);
    }, 800);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      {/* Back button */}
      <button
        onClick={() => navigate.push("/lobby")}
        className="absolute top-4 left-4 z-20 p-2 rounded-lg bg-card/80 border border-border text-muted-foreground hover:text-foreground transition-colors active:scale-95"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Battlefield */}
      <div className="flex-1 relative overflow-hidden">
        {/* Dark themed background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary to-muted" />
        {/* Floating blobs */}
        <div className="absolute top-10 right-20 w-48 h-48 rounded-full bg-primary/5 animate-blob" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-accent/5 animate-blob animation-delay-2000" />

        {/* Grid floor lines */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-10"
          style={{
            backgroundImage: "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to top, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "60px 40px",
            transform: "perspective(400px) rotateX(50deg)",
            transformOrigin: "bottom",
          }}
        />

        {/* Arena platform */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-32 rounded-[50%] bg-gradient-to-t from-border/20 to-transparent" />

        {/* Opponent Pokemon - top right */}
        <div className="absolute top-[10%] right-[12%] flex flex-col items-center">
          <div className="absolute -left-64 top-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <PokemonInfoBox pokemon={opponent} side="opponent" />
          </div>
          <div className="w-28 h-6 bg-border/20 rounded-[50%] mt-2 blur-sm" />
          <div className={`-mt-12 transition-all duration-200 ${opponentShake ? "animate-[shake_0.3s_ease-in-out]" : ""}`}>
            <img
              src={getFrontSprite(opponent.pokedexId)}
              alt={opponent.name}
              className={`w-40 h-40 object-contain drop-shadow-2xl ${opponent.hp <= 0 ? "opacity-30 grayscale" : ""}`}
            />
          </div>
        </div>

        {/* Player Pokemon - bottom left */}
        <div className="absolute bottom-[18%] left-[10%] flex flex-col items-center">
          <div className="absolute -right-64 -top-2 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <PokemonInfoBox pokemon={player} side="player" />
          </div>
          <div className="w-36 h-8 bg-border/20 rounded-[50%] mt-2 blur-sm" />
          <div className={`-mt-16 transition-all duration-200 ${playerShake ? "animate-[shake_0.3s_ease-in-out]" : ""}`}>
            <img
              src={getBackSprite(player.pokedexId)}
              alt={player.name}
              className={`w-40 h-40 object-contain drop-shadow-2xl [image-rendering:pixelated] ${player.hp <= 0 ? "opacity-30 grayscale" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* Action panel */}
      <div className="relative z-10 p-4 pb-6">
        <div className="max-w-2xl mx-auto glow-box bg-card border border-border rounded-2xl p-4 animate-slide-up" style={{ animationDelay: "600ms" }}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Message box */}
            <div className="flex-1 bg-secondary/50 rounded-xl px-4 py-3 flex items-center border border-border/50">
              <p className="text-sm font-medium">{message}</p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-56">
              <button
                onClick={handleFight}
                disabled={isAnimating || player?.hp <= 0}
                className="btn-fight rounded-xl px-4 py-3 text-sm transition-all duration-150 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                FIGHT
              </button>
              <button
                disabled={isAnimating}
                className="btn-bag rounded-xl px-4 py-3 text-sm transition-all duration-150 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                BAG
              </button>
              <button
                onClick={() => !isAnimating && setShowSwapMenu(true)}
                disabled={isAnimating}
                className="btn-pokemon rounded-xl px-4 py-3 text-sm transition-all duration-150 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                POKéMON
              </button>
              <button
                onClick={() => navigate.push("/lobby")}
                disabled={isAnimating}
                className="btn-run rounded-xl px-4 py-3 text-sm transition-all duration-150 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                RUN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Menu */}
      <Dialog open={showSwapMenu} onOpenChange={setShowSwapMenu}>
        <DialogContent className="dark bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Choose a Pokémon</DialogTitle>
            <DialogDescription>Select a Pokémon to send into battle.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {playerTeam.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSwap(i)}
                disabled={p.hp <= 0 || i === activePlayerIdx}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.97]
                  ${i === activePlayerIdx ? "border-primary/40 bg-primary/10" : p.hp <= 0 ? "border-border/30 opacity-40" : "border-border hover:border-primary/30 hover:bg-secondary/50"}
                `}
              >
                <img src={getFrontSprite(p.pokedexId)} alt={p.name} className="w-12 h-12 object-contain" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{p.name} <span className="text-muted-foreground font-normal text-xs">Lv{p.level}</span></div>
                  <HpBar current={p.hp} max={p.maxHp} showNumbers />
                </div>
                {i === activePlayerIdx && <span className="text-[10px] text-primary font-bold uppercase">Active</span>}
                {p.hp <= 0 && <span className="text-[10px] text-destructive font-bold uppercase">Fainted</span>}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Victory Popup */}
      <Dialog open={showVictory} onOpenChange={() => {}}>
        <DialogContent className="dark bg-card border-border max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-pokemon-yellow/20 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-pokemon-yellow" />
            </div>
            <DialogTitle className="text-2xl">You Won!</DialogTitle>
            <DialogDescription>All opponent Pokémon have been defeated.</DialogDescription>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => navigate.push("/lobby")} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Lobby
              </Button>
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Rematch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Defeat Popup */}
      <Dialog open={showDefeat} onOpenChange={() => {}}>
        <DialogContent className="dark bg-card border-border max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="text-3xl">💀</span>
            </div>
            <DialogTitle className="text-2xl">You Lost!</DialogTitle>
            <DialogDescription>All your Pokémon have fainted.</DialogDescription>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => navigate.push("/lobby")} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Lobby
              </Button>
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Retry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}