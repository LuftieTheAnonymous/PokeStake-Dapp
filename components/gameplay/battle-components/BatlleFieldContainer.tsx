"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import HpBar from "@/components/gameplay/battle-components/HpBar";
import { BattleRoom, PokemonBattler } from "@/lib/types";
import EnemyPokemonView from "./EnemyPokemonView";
import PlayerPokemonView from "./PlayerPokemonView";
import TopBar from "./TopBar";
import { ArrowLeft, RefreshCw, Trophy } from "lucide-react";
import {
  MAX_TURN_DURATION,
  useBattleRoomState,
} from "@/lib/state-management/useBattleRoomState";
import usePokeData from "@/hooks/usePokeData";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import BattleHook from "./BattleHook";
import { useInterval } from "@/hooks/useInterval";

function BatlleFieldContainer({
  emit,
  off,
  on,
  socket,
  once
}: {
  emit: (event: string, ...args: any[]) => void;
  on: (event: any, handler: any) => void;
  off: (event: any, handler?: any) => void;
  once:(event:any, handler:any)=>void;
  socket: Socket;
}) {
  const battleRoomState = useBattleRoomState();
  // Build player team from URL params or use default
  const { walletAddress } = usePokeData();
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSwapMenu, setShowSwapMenu] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [movePerformed, setMovePerformed] = useState(false);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFightIntro, setShowFightIntro] = useState(false);

  const playerPokemonData =
    battleRoomState.host === walletAddress
      ? {
          pokemonDeck: battleRoomState.hostPlayer?.pokemonDeck || [],
          currentPlayerPokemon: battleRoomState.hostPlayer?.currentPokemon,
        }
      : {
          pokemonDeck: battleRoomState.inviteePlayer?.pokemonDeck || [],
          currentPlayerPokemon: battleRoomState.inviteePlayer?.currentPokemon,
        };

  const opponentPokemonData =
    battleRoomState.host !== walletAddress
      ? {
          pokemonDeck: battleRoomState.hostPlayer?.pokemonDeck || [],
          currentPlayerPokemon: battleRoomState.hostPlayer?.currentPokemon,
        }
      : {
          pokemonDeck: battleRoomState.inviteePlayer?.pokemonDeck || [],
          currentPlayerPokemon: battleRoomState.inviteePlayer?.currentPokemon,
        };

  const allOpponentsDefeated =
    walletAddress === battleRoomState.host
      ? battleRoomState.inviteePlayer?.pokemonDeck.every((p) => p.hp <= 0)
      : battleRoomState.hostPlayer?.pokemonDeck.every((p) => p.hp <= 0);

  const allPlayersDefeated =
    walletAddress === battleRoomState.host
      ? battleRoomState.hostPlayer?.pokemonDeck.every((p) => p.hp <= 0)
      : battleRoomState.inviteePlayer?.pokemonDeck.every((p) => p.hp <= 0);

  const isYourTurn =
    battleRoomState.currentTurn === "host" &&
    walletAddress === battleRoomState.host
      ? true
      : battleRoomState.currentTurn === "invitee" &&
          walletAddress !== battleRoomState.host &&
          walletAddress &&
          battleRoomState.participantsAllowed.find((el) => el === walletAddress)
        ? true
        : false;

const playerJoinHandler = useEffectEvent((res: {
        data: {   
          message: string;
          battleRoom: BattleRoom;
        };
        error: null;
      }) => {
        console.log(res);
        console.log("Player join error:", res.error);
        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success(res.data.message);
        battleRoomState.updateRoomState(res.data.battleRoom);

        if (
          res.data.battleRoom.hostPlayer &&
          res.data.battleRoom.inviteePlayer &&
          walletAddress === res.data.battleRoom.host
        ) {
          emit("start-battle", res.data.battleRoom.roomId);
          setCountdown(5);
        }
      });

const playerBattleStarted = useEffectEvent(({
        message,
        battleRoom,
      }: {
        message: string;
        battleRoom: BattleRoom;
      }) => {
        setShowFightIntro(true);
        setMessage(message);
        battleRoomState.updateRoomState(battleRoom);

        const introTimeout = setTimeout(() => {
          setShowFightIntro(false);
        }, 5000);

        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev && prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev ? prev - 1 : null;
          });
        }, 1000);

        return () => {
          clearTimeout(introTimeout);
          clearInterval(countdownInterval);
        };
      });
      
const timeoutEventHandler = useEffectEvent(() => {

   if (!battleRoomState) {
    toast.error("no battle yet");
    return;
  }

    if (battleRoomState.turnChangedAt && battleRoomState.isBattleStarted && !battleRoomState.isBattleFinished) {
      const timeoutSeconds = new Date().getTime() - battleRoomState.turnChangedAt;
      if (timeoutSeconds >= MAX_TURN_DURATION) {
      console.log(battleRoomState.turnChangedAt, 'change time');
      console.log(timeoutSeconds, 'Time to be timed out');
      }
    }


  });

  const updateTheBattleResult = useEffectEvent(
    ({
      data,
    }: {
      data: {
        winnerAddress: `0x${string}` | undefined;
        message: string;
        battleRoom: BattleRoom;
      };
    }) => {
      setMessage(data.message);
      battleRoomState.updateRoomState(data.battleRoom);
      if (data.winnerAddress === walletAddress) {
        setShowVictory(true);
      } else {
        setShowDefeat(true);
      }
    }
  );

  const pokemonChangeHandler = useEffectEvent(({
        data,
        error,
      }: {
        data: {
          battleRoom: BattleRoom;
          selectedPokemon: PokemonBattler;
          message: string;
        };
        error: string | null;
      }) => {
        if (error) {
          toast.error(error);
          return;
        }

        console.log(data);

        setMessage(`Go, ${data.selectedPokemon.name}!`);
        
        setTimeout(() => {
          setMessage(data.message);
          battleRoomState.updateRoomState(data.battleRoom);
        }, 500);

        setTimeout(() => {
          setMessage(`What will ${data.selectedPokemon.name} do?`);
          setIsAnimating(false);
        }, 800);
      });
  
  
  const movePerformedHandler=useEffectEvent(({
        data,
        error,
      }: {
        data: {
          battleRoom: BattleRoom;
          damage: number;
          message: string;
        };
        error: string | null;
      }) => {
        if (error) {
          toast.error(error);
          return;
        }

        if (
          isAnimating ||
          !playerPokemonData ||
          !opponentPokemonData ||
          !playerPokemonData.currentPlayerPokemon ||
          !opponentPokemonData.currentPlayerPokemon ||
          playerPokemonData.currentPlayerPokemon.hp <= 0 ||
          opponentPokemonData.currentPlayerPokemon.hp <= 0
        )
          return;

        setIsAnimating(true);
        // RESET shakes immediately
        setPlayerHit(false);

        const lastMoveCommiter =
          data.battleRoom.moveHistory[data.battleRoom.moveHistory.length - 1]
            .player;
        const youAttacked =
          (lastMoveCommiter === "host" &&
            walletAddress === battleRoomState.host) ||
          (lastMoveCommiter === "invitee" &&
            walletAddress !== battleRoomState.host);

        if (youAttacked) {
          // You attacked, opponent shakes
          const newOpHp = Math.max(
            0,
            (opponentPokemonData.currentPlayerPokemon as PokemonBattler).hp -
              data.damage,
          );

          setTimeout(() => {
            setPlayerHit(true);
          }, 0);

          setTimeout(() => {
            setPlayerHit(false);

            if (newOpHp <= 0) {
              setMessage(
                `${(opponentPokemonData.currentPlayerPokemon as PokemonBattler).name} fainted!`,
              );
              setTimeout(() => {
                battleRoomState.updateRoomState(data.battleRoom);
                setIsAnimating(false);
              }, 1000);
            } else {
              setTimeout(() => {
                setMessage(data.message);
                battleRoomState.updateRoomState(data.battleRoom);
                setIsAnimating(false);
              }, 400);
            }
          }, 500);
        } else {
          // Opponent attacked, you shake
          const newPlHp = Math.max(
            0,
            (playerPokemonData.currentPlayerPokemon as PokemonBattler).hp -
              data.damage,
          );

          setTimeout(() => {
            setMessage(data.message);

            setTimeout(() => {
              setPlayerHit(true);
            }, 0);

            setTimeout(() => {
              setPlayerHit(false);

              if (newPlHp <= 0) {
                setMessage(
                  `${(playerPokemonData.currentPlayerPokemon as PokemonBattler).name} fainted!`,
                );
                setTimeout(() => {
                  const nextAlive = playerPokemonData.pokemonDeck.findIndex(
                    (p) =>
                      p.pokemonId !==
                        playerPokemonData.currentPlayerPokemon?.pokemonId &&
                      p.hp > 0,
                  );
                  if (nextAlive !== -1) {
                    setShowSwapMenu(true);
                  }
                  battleRoomState.updateRoomState(data.battleRoom);
                  setIsAnimating(false);
                }, 700);
              } else {
                setTimeout(() => {
                  setMessage(`What will ${walletAddress} do?`);
                  battleRoomState.updateRoomState(data.battleRoom);
                  setIsAnimating(false);
                }, 500);
              }
            }, 400);
          }, 800);
        }
        setMovePerformed(false);
      });

  
  const timeoutHandler = useEffectEvent((res:{data: {
    message: string;
    battleRoom: BattleRoom;
}, error:null})=>{
  setMessage(res.data.message);
  battleRoomState.updateRoomState(res.data.battleRoom);
  })

  useEffect(() => {
    if (
      (allOpponentsDefeated && !showVictory) ||
      (allPlayersDefeated && !showDefeat)
    ) {
      emit("finish-battle", battleRoomState.roomId);
    }
  }, [allOpponentsDefeated, allPlayersDefeated, showVictory, showDefeat]);

useInterval(()=>{
  timeoutEventHandler();
}, 1000);

useEffect(()=>{
  on('turn-timeout', timeoutHandler);

  return ()=>{
    off('turn-timeout');
  }
},[])

  useEffect(() => {
    on(
      "player-joined",
      playerJoinHandler
    );

    return () => {
      off("player-joined");
    };
  }, []);

  useEffect(() => {
    once(
      "battle-started",
      playerBattleStarted
    );

    return () => {
      off("battle-started");
    };
  }, [socket, battleRoomState]);

  useEffect(() => {
    once(
      "battle-finished",
      updateTheBattleResult
    );

    return () => {
      off("battle-finished");
    };
  }, []);

  useEffect(() => {
    on(
      "pokemon-change",
    pokemonChangeHandler
    );

    return () => {
      off("pokemon-change");
    };
  }, [battleRoomState, socket]);

  useEffect(() => {
    on(
      "move-performed",
      movePerformedHandler
    );

    return ()=> off('move-pefrormed');
  }, []);

    useEffect(() => {
    if (battleRoomState.currentTurn)
      setMessage(
        `What will ${battleRoomState.currentTurn === "host" ? battleRoomState.host : battleRoomState.inviteePlayer?.playerNickname} do?`,
      );
  }, [
    battleRoomState.currentTurn
  ]);



  const handleFight = () => {
    emit("perform-move", battleRoomState.roomId);
    setMovePerformed(true);
  };

  const handleSwap = (idx: number) => {
    const selectedPokemon = playerPokemonData.pokemonDeck.find(
      (p) => p.pokemonId === idx && p.hp > 0,
    );

    if (
      !selectedPokemon ||
      idx === playerPokemonData.currentPlayerPokemon?.pokemonId
    )
      return;
    emit("swap-pokemon", battleRoomState.roomId, selectedPokemon);
    setShowSwapMenu(false);
  };



  return (
    <>
      {/* Battlefield */}
      {showFightIntro && (
        <BattleHook countdown={countdown} showFightIntro={showFightIntro} />
      )}

      <div className="flex-1 relative overflow-hidden">
        <TopBar
          walletAddress={walletAddress as `0x${string}`}
          roomDetails={battleRoomState}
          leaveBattle={() => emit("leave-battle-room", battleRoomState.roomId)}
          areAllPlayersInRoom={
            battleRoomState.inviteePlayer !== null &&
            battleRoomState.hostPlayer !== null
          }
        />
        {/* Sky gradient */}
        <div className="absolute h-screen inset-0 bg-gradient-to-b from-[hsl(200,60%,70%)] via-[hsl(120,30%,65%)] to-[hsl(100,35%,50%)]" />

        {/* Ground plane */}
        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-[hsl(100,30%,40%)] to-[hsl(100,35%,50%)]" />

        {/* Opponent Pokemon - top right area */}
        {opponentPokemonData.currentPlayerPokemon && (
          <EnemyPokemonView
            opponent={opponentPokemonData.currentPlayerPokemon}
            opponentShake={isYourTurn && playerHit}
          />
        )}

        {/* Player Pokemon - bottom left area */}
        {playerPokemonData.currentPlayerPokemon && (
          <PlayerPokemonView
            player={playerPokemonData.currentPlayerPokemon}
            playerShake={!isYourTurn && playerHit}
          />
        )}
      </div>

      {/* Action panel */}
      <div className="relative z-10 p-4 pb-6">
        <div
          className="max-w-2xl mx-auto glow-box bg-card border border-border rounded-2xl p-4 animate-slide-up"
          style={{ animationDelay: "600ms" }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Message box */}
            <div className="flex-1 bg-secondary/50 rounded-xl px-4 py-3 flex items-center border border-border/50">
              {!battleRoomState.hostPlayer ||
                (!battleRoomState.inviteePlayer && (
                  <p className="text-sm font-medium">
                    Waiting for opponent to join...
                  </p>
                ))}
              <p className="text-sm font-medium">{message}</p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-56">
              <button
                onClick={handleFight}
                disabled={
                  isAnimating ||
                  movePerformed ||
                  !isYourTurn ||
                  (playerPokemonData.currentPlayerPokemon &&
                    playerPokemonData.currentPlayerPokemon.hp <= 0)
                }
                className="btn-fight rounded-xl px-4 py-3 text-sm transition-all duration-150 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                FIGHT
              </button>
              <button
                disabled={isAnimating || movePerformed || !isYourTurn}
                className="btn-bag rounded-xl px-4 py-3 text-sm transition-all duration-150 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                BAG
              </button>
              <button
                onClick={() => !isAnimating && setShowSwapMenu(true)}
                disabled={isAnimating || movePerformed || !isYourTurn}
                className="btn-pokemon rounded-xl px-4 py-3 text-sm transition-all duration-150 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                POKéMON
              </button>
              <button
                onClick={() => redirect("/lobby")}
                disabled={isAnimating || movePerformed || !isYourTurn}
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
            <DialogDescription>
              Select a Pokémon to send into battle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {playerPokemonData.pokemonDeck.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSwap(p.pokemonId)}
                disabled={
                  p.hp <= 0 ||
                  p.pokemonId ===
                    (playerPokemonData.currentPlayerPokemon as PokemonBattler)
                      .pokemonId
                }
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.97]
                  ${p.pokemonId === (playerPokemonData.currentPlayerPokemon as PokemonBattler).pokemonId ? "border-primary/40 bg-primary/10" : p.hp <= 0 ? "border-border/30 opacity-40" : "border-border hover:border-primary/30 hover:bg-secondary/50"}
                `}
              >
                <img
                  src={p.sprites.front}
                  alt={p.name}
                  className="w-12 h-12 object-contain"
                />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">
                    {p.name}{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      Rar.lvl.{" "}
                      {playerPokemonData.currentPlayerPokemon!.rarityLevel}
                    </span>
                  </div>
                  <HpBar current={p.hp} max={p.maxHp} showNumbers />
                </div>
                {p.pokemonId ===
                  playerPokemonData.currentPlayerPokemon?.pokemonId && (
                  <span className="text-[10px] text-primary font-bold uppercase">
                    Active
                  </span>
                )}
                {p.hp <= 0 && (
                  <span className="text-[10px] text-destructive font-bold uppercase">
                    Fainted
                  </span>
                )}
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
            <DialogDescription>
              All opponent Pokémon have been defeated.
            </DialogDescription>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => redirect("/lobby")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Lobby
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="gap-2"
              >
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
            <DialogDescription>
              All your Pokémon have fainted.
            </DialogDescription>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => redirect("/lobby")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Lobby
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BatlleFieldContainer;
