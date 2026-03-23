import { PokemonCard } from '@/lib/types';
import DeckCard from './DeckCard';
import { Ghost, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
            {pokeCards.length === 0 && <div className='w-full mx-auto flex justify-between items-center gap-2 flex-col'>
                <Ghost className='text-muted-foreground'/>
                <p className='text-sm'>You have no cards available. If your cooldown-time is down, try to draw another card.</p>
                    <Link href="/draw">
                <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Draw Card
                </Button>
              </Link>
                </div>}

            {pokeCards.length > 0 &&
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
            }
        </div>
    );
}

export default NftDeck;
