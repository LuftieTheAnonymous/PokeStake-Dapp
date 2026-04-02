import { PokemonBattler } from '@/lib/types';
import React from 'react'
import PokemonInfoBox from './PokemonInfoBox';
import '@/components/components-styles.css';


type Props = {
    player: PokemonBattler;
    playerShake: boolean;   
}

function PlayerPokemonView({ player, playerShake }: Props) {
  return (
        <div className="absolute bottom-[22%] left-[12%] flex flex-col items-center">
             {/* Info box to the right */}
             <div className="absolute -right-72 -top-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
               <PokemonInfoBox pokemon={player} side="player" />
             </div>
             {/* Platform */}
             <div className="w-44 h-10 bg-[hsl(100,25%,42%)] rounded-[50%] shadow-lg mt-2" />
             {/* Sprite */}
             <div className={`text-8xl -mt-20 animate-battle-entrance ${playerShake ? "animate-pokemon-damaged" : ""}`} style={{ "--enter-x": "-120px" } as React.CSSProperties}>
                 <img
           src={player.sprites.back}
           alt={player.name}
           className={`w-48 h-48 -mt-16 object-contain drop-shadow-2xl [image-rendering:pixelated] ${player.hp <= 0 ? "opacity-30 grayscale" : ""}`}
         />
             </div>
           </div>
  )
}

export default PlayerPokemonView