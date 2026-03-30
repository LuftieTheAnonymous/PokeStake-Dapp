'use client';

import { useEffect, useMemo, useState } from 'react'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import HpBar from "@/components/gameplay/battle-components/HpBar";
import { PokemonBattler } from '@/lib/types';
import { redirect, useSearchParams } from 'next/navigation';
import EnemyPokemonView from './EnemyPokemonView';
import PlayerPokemonView from './PlayerPokemonView';
import TopBar from './TopBar';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { useBattleRoomState } from '@/lib/state-management/useBattleRoomState';
import usePokeData from '@/hooks/usePokeData';



function BatlleFieldContainer({emit}:{emit:(event:string, ...args:any[])=>void}) {
 const battleRoomState =useBattleRoomState(); 
  // Build player team from URL params or use default

  const {walletAddress}=usePokeData();
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSwapMenu, setShowSwapMenu] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [opponentShake, setOpponentShake] = useState(false);    

  const playerPokemonData = useMemo(()=>{
 return   battleRoomState.host === walletAddress ? {
        pokemonDeck: battleRoomState.hostPlayer?.pokemonDeck || [],
        currentPlayerPokemon: battleRoomState.hostPlayer?.currentPokemon   
    } : {
        pokemonDeck: battleRoomState.inviteePlayer?.pokemonDeck || [],
        currentPlayerPokemon: battleRoomState.inviteePlayer?.currentPokemon
    };
  },[walletAddress, battleRoomState]);

const opponentPokemonData = useMemo(()=>{
    return battleRoomState.host !==  walletAddress ? {
        pokemonDeck: battleRoomState.hostPlayer?.pokemonDeck || [],
        currentPlayerPokemon: battleRoomState.hostPlayer?.currentPokemon   
    }: {
        pokemonDeck: battleRoomState.inviteePlayer?.pokemonDeck || [],
        currentPlayerPokemon: battleRoomState.inviteePlayer?.currentPokemon
    }
},[battleRoomState, walletAddress]);


  useEffect(() => {
    if (battleRoomState.currentTurn) setMessage(`What will ${battleRoomState.currentTurn === 'host' ? battleRoomState.host : battleRoomState.inviteePlayer?.playerNickname} do?`);
  }, [battleRoomState.currentTurn, battleRoomState.host, battleRoomState.inviteePlayer]);

  const allOpponentsDefeated = walletAddress === battleRoomState.host ? battleRoomState.inviteePlayer?.pokemonDeck.every((p) => p.hp <= 0) : battleRoomState.hostPlayer?.pokemonDeck.every((p) => p.hp <= 0);
  const allPlayersDefeated = walletAddress === battleRoomState.host ? battleRoomState.hostPlayer?.pokemonDeck.every((p) => p.hp <= 0) : battleRoomState.inviteePlayer?.pokemonDeck.every((p) => p.hp <= 0);

  useEffect(() => {
    if (allOpponentsDefeated && !showVictory) setShowVictory(true);
    if (allPlayersDefeated && !showDefeat) setShowDefeat(true);
  }, [allOpponentsDefeated, allPlayersDefeated, showVictory, showDefeat]);

  const calcDamage = (attacker: PokemonBattler, defender: PokemonBattler) => {
    const base = Math.floor(((2 * attacker.rarityLevel / 5 + 2) * attacker.attack / defender.defense) / 10) + 2;
    const variance = 0.85 + Math.random() * 0.15;
    return Math.max(1, Math.floor(base * variance));
  };

  const advanceOpponent = () => {
    const nextAlive = opponentPokemonData.pokemonDeck.findIndex((p) => p.pokemonId !== opponentPokemonData.currentPlayerPokemon?.pokemonId && p.hp > 0);
    if (nextAlive !== -1) {
      setMessage(`Opponent sent out ${opponentPokemonData.pokemonDeck[nextAlive].name}!`);
    } else {
      const anyAlive = opponentPokemonData.pokemonDeck.findIndex((p) => p.hp > 0);
      if (anyAlive !== -1) {
        setMessage(`Opponent sent out ${opponentPokemonData.pokemonDeck[anyAlive].name}!`);
      }
    }
  };

  const handleFight = () => {
    if (isAnimating || !playerPokemonData || !opponentPokemonData || !playerPokemonData.currentPlayerPokemon || !opponentPokemonData.currentPlayerPokemon || playerPokemonData.currentPlayerPokemon.hp <= 0 || opponentPokemonData.currentPlayerPokemon.hp <= 0) return;
    setIsAnimating(true);

    const playerDmg = calcDamage(playerPokemonData.currentPlayerPokemon, opponentPokemonData.currentPlayerPokemon);
    setMessage(`${playerPokemonData.currentPlayerPokemon.name} caused a damage to ${opponentPokemonData.currentPlayerPokemon.name} (-${playerDmg.toFixed(1)} HP)!`);
    setOpponentShake(true);

    setTimeout(() => {
      setOpponentShake(false);
      const newOpHp = Math.max(0, (opponentPokemonData.currentPlayerPokemon as PokemonBattler).hp - playerDmg);
      // setOpponentTeam((prev) => prev.map((p, i) => i === activeOpponentIdx ? { ...p, hp: newOpHp } : p));

      if (newOpHp <= 0) {
        setMessage(`${(opponentPokemonData.currentPlayerPokemon as PokemonBattler).name} fainted!`);
        setTimeout(() => {
          advanceOpponent();
          setIsAnimating(false);
        }, 1200);
        return;
      }

      setTimeout(() => {
        const opDmg = calcDamage((opponentPokemonData.currentPlayerPokemon as PokemonBattler), playerPokemonData.currentPlayerPokemon as PokemonBattler);
        setMessage(`${opponentPokemonData.currentPlayerPokemon?.name} has caused a damage to ${playerPokemonData.currentPlayerPokemon?.name} (-${opDmg.toFixed(1)} HP) !`);
        setPlayerShake(true);

        setTimeout(() => {
          setPlayerShake(false);
          const newPlHp = Math.max(0, (playerPokemonData.currentPlayerPokemon as PokemonBattler).hp - opDmg);
         

          if (newPlHp <= 0) {
            setMessage(`${(playerPokemonData.currentPlayerPokemon as PokemonBattler).name} fainted!`);
            setTimeout(() => {
              const nextAlive = playerPokemonData.pokemonDeck.findIndex((p) => p.pokemonId !== playerPokemonData.currentPlayerPokemon?.pokemonId && p.hp > 0);
              if (nextAlive !== -1) {
                setShowSwapMenu(true);
              }
              setIsAnimating(false);
            }, 1000);
          } else {
            setTimeout(() => {
              setMessage(`What will ${walletAddress} do?`);
              setIsAnimating(false);
            }, 500);
          }
        }, 400);
      }, 800);
    }, 600);
  };

  const handleSwap = (idx: number) => {
    const selectedPokemon = playerPokemonData.pokemonDeck.find((p)=> p.pokemonId  === idx && p.hp > 0);

    if (!selectedPokemon || idx === playerPokemonData.currentPlayerPokemon?.pokemonId) return;
    setShowSwapMenu(false);
    setMessage(`Go, ${selectedPokemon.name}!`);
    setTimeout(() => {
      setMessage(`What will ${selectedPokemon.name} do?`);
      setIsAnimating(false);
    }, 800);
  };

  return (
  <>
  {/* Battlefield */}
      <div className="flex-1 relative overflow-hidden">
        <TopBar leaveBattle={()=>emit('leave-battle-room', battleRoomState.roomId)}  roomId={battleRoomState.roomId} areAllPlayersInRoom={battleRoomState.inviteePlayer !== null && battleRoomState.hostPlayer !== null} />
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,60%,70%)] via-[hsl(120,30%,65%)] to-[hsl(100,35%,50%)]" />

        {/* Ground plane */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[hsl(100,30%,40%)] to-[hsl(100,35%,50%)]" />

        {/* Opponent Pokemon - top right area */}
        {opponentPokemonData.currentPlayerPokemon &&
   <EnemyPokemonView opponent={opponentPokemonData.currentPlayerPokemon} opponentShake={opponentShake}/>
   }
   
        {/* Player Pokemon - bottom left area */}
        {playerPokemonData.currentPlayerPokemon &&
        <PlayerPokemonView player={playerPokemonData.currentPlayerPokemon} playerShake={playerShake} />
        }
      </div>

      {/* Action panel */}
      <div className="relative z-10 p-4 pb-6">
        <div className="max-w-2xl mx-auto glow-box bg-card border border-border rounded-2xl p-4 animate-slide-up" style={{ animationDelay: "600ms" }}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Message box */}
            <div className="flex-1 bg-secondary/50 rounded-xl px-4 py-3 flex items-center border border-border/50">
              {!battleRoomState.hostPlayer || !battleRoomState.inviteePlayer && <p className="text-sm font-medium">Waiting for opponent to join...</p>}
              <p className="text-sm font-medium">{message}</p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-56">
              <button
                onClick={handleFight}
                disabled={isAnimating || playerPokemonData.currentPlayerPokemon && playerPokemonData.currentPlayerPokemon.hp <= 0}
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
                onClick={() => redirect("/lobby")}
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
            {playerPokemonData.pokemonDeck.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSwap(p.pokemonId)}
                disabled={p.hp <= 0 || p.pokemonId === (playerPokemonData.currentPlayerPokemon as PokemonBattler).pokemonId}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.97]
                  ${p.pokemonId === (playerPokemonData.currentPlayerPokemon as PokemonBattler).pokemonId ? "border-primary/40 bg-primary/10" : p.hp <= 0 ? "border-border/30 opacity-40" : "border-border hover:border-primary/30 hover:bg-secondary/50"}
                `}
              >
                <img src={p.sprites.front} alt={p.name} className="w-12 h-12 object-contain" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">{p.name} <span className="text-muted-foreground font-normal text-xs">Rar.lvl. {playerPokemonData.currentPlayerPokemon!.rarityLevel}</span></div>
                  <HpBar current={p.hp} max={p.maxHp} showNumbers />
                </div>
                {p.pokemonId === playerPokemonData.currentPlayerPokemon?.pokemonId && <span className="text-[10px] text-primary font-bold uppercase">Active</span>}
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
              <Button variant="outline" onClick={() => redirect("/lobby")} className="gap-2">
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
              <Button variant="outline" onClick={() => redirect("/lobby")} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Lobby
              </Button>
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Retry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  
  </>
  )
}

export default BatlleFieldContainer