'use client';

import { Button } from '@/components/ui/button';
import { BattleRoom } from '@/lib/types';
import { ArrowLeft, PlayCircleIcon } from 'lucide-react';
import { useRef, useState } from 'react'
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { toast } from 'sonner';

type Props = {
  areAllPlayersInRoom:boolean,  
  walletAddress:`0x${string}`,
  roomDetails:BattleRoom,
  leaveBattle:()=>void,
  startBattle?:()=>void
};

function TopBar({areAllPlayersInRoom, walletAddress, roomDetails, leaveBattle, startBattle}: Props) {
 const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted]=useState<boolean>(false);
  return (
<>
<audio ref={audioRef} src={areAllPlayersInRoom ? "/sound-effects/BattleBg.mp3" : '/sound-effects/BattleWaitingTheme.mp3'} autoPlay={!muted} loop={!muted} />
      {/* Back button */}

      <div className="absolute top-4 left-4 z-20 flex gap-3 items-center">
      <button
        onClick={leaveBattle}
        className="p-2 rounded-lg bg-card/80 border border-border text-muted-foreground hover:text-foreground transition-colors active:scale-95"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>        

      <button
        onClick={() =>{
          if(!audioRef.current){
            toast.error("Could not play or stop the song.")
            return;
          }

          audioRef.current.currentTime=0;

          if(muted){
            audioRef.current.play();
            setMuted(false);
          }else{
            audioRef.current!.pause();
            setMuted(true);
          }
        }}
        className="p-2 rounded-lg bg-card/80 border border-border text-muted-foreground hover:text-foreground transition-colors active:scale-95"
      >
        {!muted ? 
        <FaVolumeUp className="w-5 h-5" /> : <FaVolumeMute className="w-5 h-5"/>}
      </button>
      
      {!roomDetails.startTime && roomDetails.host === walletAddress &&
      <Button onClick={startBattle} disabled={!roomDetails.hostPlayer || !roomDetails.inviteePlayer} className='bg-green-600 hover:bg-green-700 cursor-pointer border-2 px-4 py-3 border-amber-900 '>Start Battle <PlayCircleIcon /> </Button>
      }
      
      </div>
</>
  )
}

export default TopBar