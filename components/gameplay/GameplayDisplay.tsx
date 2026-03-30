'use client';
import { useBattleRoomState } from '@/lib/state-management/useBattleRoomState'
import LobbyPanel from './lobby/LobbyPanel'
import BatlleFieldContainer from './battle-components/BatlleFieldContainer'
import useSocketIo from '@/hooks/useSocketIo';

type Props = {}

function GameplayDisplay({}: Props) {
    const {roomId}=useBattleRoomState();
    const {emit}=useSocketIo();
  return (
   <>
   {!roomId ? (  <div className=" min-h-screen text-foreground">

      {/* Floating blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 animate-blob" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-accent/5 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pokemon-yellow/5 animate-blob animation-delay-4000" />
      </div>

      <LobbyPanel emit={emit} />
    
    </div>): (
          <div className="dark min-h-screen flex flex-col">
      <BatlleFieldContainer emit={emit} />
    </div>
    )}
   </>
  )
}

export default GameplayDisplay