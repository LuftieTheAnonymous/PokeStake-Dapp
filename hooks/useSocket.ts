import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import usePokeData from "./usePokeData";
import { useGameplayLobby } from "@/lib/state-management/useGameplayLobby";
import { BattleRoom } from "@/lib/types";
import { toast } from "sonner";
import { useBattleRoomState } from "@/lib/state-management/useBattleRoomState";

function useSocket() {
  const socketRef = useRef<Socket>(null);
  const isConnectedRef = useRef(false);
  const { walletAddress } = usePokeData();
  const { clearPokemonSet } = useGameplayLobby();
  const { updateRoomState, clearRoomState, roomId } = useBattleRoomState();

  const emit = useCallback(
    (event: any, ...data: any[]) => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit(event, ...data);
      } else {
        console.warn("Socket not connected");
      }
    },
    [socketRef],
  );

  const once = useCallback(
    (event: any, listener: any) => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.once(event, listener);
      } else {
        console.warn("Socket not connected");
      }
    },
    [socketRef],
  );

  const on = useCallback(
    (event: any, handler: any) => {
      if (socketRef.current) {
        socketRef.current.on(event, handler);
      }
    },
    [socketRef],
  );

  const off = useCallback(
    (event: any, handler?: any) => {
      if (socketRef.current) {
        socketRef.current.off(event, handler);
      }
    },
    [socketRef],
  );

  useEffect(() => {
    // Only create socket once
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL, {
        auth: {
          walletAddress,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketRef.current.on("connect", () => {
        isConnectedRef.current = true;
        console.log("Socket connected:", (socketRef.current as Socket).id);
      });

      socketRef.current.on("pokemonTransferred", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("pokemonStaked", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("pokemonBurnt", (event) => {
        toast.info(`${event.message} (Owner: ${event.owner})`);
      });

      socketRef.current.on("pokemonUnstaked", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("rewardsClaimed", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("pokemonListed", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("pokemonSold", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("pokemonListingPrelonged", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("pokemonListingPrelongFailed", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("pokemonDelistedFailed", (event) => {
        toast.info(event.message);
      });

      socketRef.current.on("pokemonDelisted", (event) => {
        toast.info(event.message);
      });

      // Battle room notifications

      socketRef.current.on("invalid-battle-room", (data) => {
        console.log("Invalid battle room:", data);
        toast.error(`${data.error}`);
      });

      socketRef.current.on(
        "in-game-message",
        ({
          message,
          messageType,
          sentBy,
        }: {
          message: string;
          sentBy: `0x${string}`;
          messageType: "success" | "error" | "info" | "warning" | null;
        }) => {
          toast[messageType || "info"](
            `${sentBy ? `${sentBy}: ` : ""}${message}`,
          );
        },
      );

      socketRef.current.on(
        "battle-room-created",
        (data: { battleRoom: BattleRoom; roomId: string }) => {
          // implement storage in zustand and change of the state.
          console.log("Battle room created:", data.battleRoom);
          updateRoomState(data.battleRoom);
          toast.success(`Battle room created ! Redirecting...`);
        },
      );

      socketRef.current.on(
        "not_member",
        (data: { data: null; error: string }) => {
          console.log("Not member of the battle room:", data.error);
          toast.error(`${data.error}`);
          clearPokemonSet();
          clearRoomState();
        },
      );

      socketRef.current.on(
        "join-response",
        (response: {
          data: { battleRoom: BattleRoom; message: string };
          error: null;
        }) => {
          if (response.error) {
            toast.error(response.error);
            return;
          }
          console.log("Join response:", response.data.battleRoom.inviteePlayer);
          updateRoomState(response.data.battleRoom);
          toast.success(`Joined battle room ! Redirecting...`);
        },
      );

      socketRef.current.on(
        "left-room",
        (res: {
          data: { message: string; battleRoom: BattleRoom };
          error: string | null;
        }) => {
          console.log("Connection error:", res.error);
          if (res.error) {
            toast.error(res.error);
            return;
          }
          toast.success(res.data.message);
          clearRoomState();
          clearPokemonSet();
        },
      );

      socketRef.current.on(
        "player-left",
        (res: {
          data: { message: string; battleRoom: BattleRoom };
          error: string | null;
        }) => {
          console.log("Player left:", res.error);
          if (res.error) {
            toast.error(res.error);
            return;
          }

          if (res.data.battleRoom.isBattleStarted) {
            emit("finish-battle", res.data.battleRoom.roomId);
          }

          toast.success(res.data.message);
          updateRoomState(res.data.battleRoom);
        },
      );

      socketRef.current.on("disconnect", () => {
        isConnectedRef.current = false;
      });
    }

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [walletAddress]);

  return { once, emit, on, off, socketRef, isConnectedRef };
}

export default useSocket;
