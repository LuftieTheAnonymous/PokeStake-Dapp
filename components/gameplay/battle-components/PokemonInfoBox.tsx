import { PokemonBattler } from "@/lib/types";
import HpBar from "./HpBar";



function PokemonInfoBox({ pokemon, side }: { pokemon: PokemonBattler; side: "player" | "opponent" }) {
  const isPlayer = side === "player";
  return (
    <div className="glow-box bg-card/90 border border-border rounded-xl px-4 py-3 w-56 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-sm capitalize">{pokemon.name}</span>
        <span className="text-xs text-muted-foreground font-mono">Rar.Lv. {pokemon.rarityLevel}</span>
      </div>
      <HpBar current={pokemon.hp} max={pokemon.maxHp} showNumbers={isPlayer} />
    </div>
  );
}

export default PokemonInfoBox;