import React from 'react'
import PokemonInfoBox from './PokemonInfoBox'
import { PokemonBattler } from '@/lib/types';
import '@/components/components-styles.css';

type Props = {
  opponent: PokemonBattler;
  opponentShake: boolean;
}

function EnemyPokemonView({ opponent, opponentShake }: Props) {
  return (
       <div className="absolute top-[12%] right-[15%] flex flex-col items-center" style={{ "--enter-x": "120px" } as React.CSSProperties}>
          {/* Info box above/left */}
          <div className="absolute -left-72 top-0 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <PokemonInfoBox pokemon={opponent} side="opponent" />
          </div>
          {/* Platform */}
          <div className="w-32 h-8 bg-[hsl(100,25%,45%)] rounded-[50%] shadow-lg mt-2" />
          {/* Sprite */}
          <div className={`text-7xl -mt-16 animate-battle-entrance ${opponentShake ? "animate-pokemon-damaged" : ""}`} style={{ "--enter-x": "120px" } as React.CSSProperties}>
   <img
        src={opponent.sprites.front}
        alt={opponent.name}
        className={`w-48 h-48 -mt-20 object-contain drop-shadow-2xl [image-rendering:pixelated] ${opponent.hp <= 0 ? "opacity-30 grayscale" : ""}`}
      />
          </div>
        </div>
  )
}

export default EnemyPokemonView