import { PokemonCard } from '@/lib/types';
import DeckCard from './DeckCard';

type Props = {
    pokeCards: PokemonCard[];
    addToSlot: (pokeCard: PokemonCard) => void;
    handleDragStart: (pokeCard: PokemonCard) => void;
    selectedCards: PokemonCard[];
}

function NftDeck({
    pokeCards,
    addToSlot,
    handleDragStart,
    selectedCards
}: Props) {
    return (
        <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <h2 className="text-lg font-semibold mb-3">Your NFT Deck</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5
             gap-4">
                {pokeCards.map((card) => {
                    const isSelected = selectedCards.includes(card);
                    return (
                        <DeckCard
                            key={card.attributes.id}
                            card={card}
                            onDragStart={() => handleDragStart(card)}
                            onClick={() => !isSelected && addToSlot(card)}
                            disabled={isSelected}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default NftDeck;
