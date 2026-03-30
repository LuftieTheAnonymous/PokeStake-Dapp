import { GripVertical } from 'lucide-react';
import { PokemonCard } from '@/lib/types';

type Props = {
    handleDropOnSlot: () => void;
    selectedCards: PokemonCard[];
    MAX_SELECTED: number;
    removeFromSlot: (pokeCard: PokemonCard) => void;
}

function BattleSlots({
    handleDropOnSlot,
    selectedCards,
    MAX_SELECTED,
    removeFromSlot
}: Props) {
    return (
        <div className="mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <h2 className="text-lg font-semibold mb-3">Your Team ({selectedCards.length}/{MAX_SELECTED})</h2>
            <div className="flex gap-4 flex-wrap justify-center items-center
            ">
                {Array.from({ length: MAX_SELECTED }).map((_, i) => {
                    const card = selectedCards[i];
                    return (
                        <div
                            key={i}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDropOnSlot}
                            className={`w-40 h-56 cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center
                                ${card 
                                    ? "border-primary/40 bg-card glow-box cursor-default opacity-60" 
                                    : "border-border/40 bg-secondary/30 hover:border-primary/20"
                                }`}
                            onClick={() => card && removeFromSlot(card)}
                        >
                            {card ? (
                                <>
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="w-20 h-20 object-contain drop-shadow-lg mb-2"
                                    />
                                    <span className="text-sm capitalize font-semibold">{card.name}</span>
                                    <span className="text-[10px] text-muted-foreground mt-0.5">Tap to remove</span>
                                </>
                            ) : (
                                <>
                                    <GripVertical className="w-6 h-6 text-muted-foreground/40 mb-1" />
                                    <span className="text-xs text-muted-foreground/60">Drop here</span>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BattleSlots;
