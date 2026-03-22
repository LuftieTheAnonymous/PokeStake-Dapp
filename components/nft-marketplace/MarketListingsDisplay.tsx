"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircleIcon, Loader2, Package } from "lucide-react";
import NFTCard from "@/components/nft-marketplace/Listing";
import FilterSidebar, { type SortOption } from "@/components/nft-marketplace/FIlterSideBar";
import { type Currency } from "@/lib/types";
import usePokeData from "@/hooks/usePokeData";
import { useQuery } from "@tanstack/react-query";
import { PokemonCard, SaleListing } from "@/lib/types";
import { pinata } from "@/utils/PinataConfig";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};


function MarketListingsDisplay() {

  const [currency, setCurrency] = useState<"ALL" | Currency>("ALL");
  const [sort, setSort] = useState<SortOption>("recent");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {getListings}=usePokeData();
  
  const {data, isLoading, error} = useQuery({
    queryKey:["pokeCards-marketplace"],
    queryFn: async ()=>{
 let nftCards: {saleDetails: SaleListing, card:PokemonCard}[] = [];

 if(!getListings){
  return nftCards;
 }
 
   for (let index = 0; index < getListings.length; index++) {
      const pokeCard:SaleListing = getListings[index];

      if(!pokeCard || pokeCard.listingPrice === BigInt(0)){
        continue;
      }

      const httpsInitial= `https://${process.env.NEXT_PUBLIC_API_ENDPOINT}/ipfs/`;

      const cid = pokeCard.tokenURI.slice(httpsInitial.length);

      try {
        const pinataFoundElement = await pinata.gateways.public.get(cid);
        
        if (pinataFoundElement.data) {
          nftCards.push({
            saleDetails: {...pokeCard, tokenURI:cid},
            card: pinataFoundElement.data as unknown as PokemonCard,
          });
        }
      } catch (err) {
        console.error(`Failed to fetch card ${pokeCard.listingId}:`, err);
      }
    }

    return nftCards;
      
    }
  });


  const filteredNFTs = useMemo(() => {
    let result = data && data.length > 0 ? data : [];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (nft) =>
          nft.card.name.toLowerCase().includes(q) ||
          nft.card.name.toLowerCase().includes(q)
      );
    }

    // Currency filter
    if (currency !== "ALL") {
      result = result.filter((nft) => currency === 'ETH' ? nft.saleDetails.isPriceInEth : !nft.saleDetails.isPriceInEth);
    }

    // Price range
    if (minPrice) {
      result = result.filter((nft) => Number(nft.saleDetails.isPriceInEth) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((nft) => Number(nft.saleDetails.isPriceInEth) <= parseFloat(maxPrice));
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => Number(a.saleDetails.isPriceInEth) - Number(b.saleDetails.isPriceInEth));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.saleDetails.isPriceInEth) - Number(a.saleDetails.isPriceInEth));
        break;
      case "recent":
      default:
        result.sort((a, b) => Number(b.saleDetails.listingBlockNumber) - Number(a.saleDetails.listingBlockNumber));
        break;
    }

    return result;
  }, [data, currency, sort, minPrice, maxPrice, searchQuery]);


  return (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mt-4">
          <FilterSidebar
            currency={currency}
            setCurrency={setCurrency}
            sort={sort}
            setSort={setSort}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="flex-1">
        {isLoading && !error && filteredNFTs.length === 0 &&     
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted py-20 px-6">
                <Loader2 className="h-10 w-10 text-primary mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  Loading pokecards...
                </p>
              </div>}


            {!isLoading && error && filteredNFTs.length === 0 &&     
            <div className="flex flex-col items-center justify-center rounded-xl bg-muted py-20 px-6">
                <AlertCircleIcon className="h-10 w-10 text-primary mb-3" />
                <p className="text-sm text-red-500 font-medium">
                  Error occured: {error.message}
                </p>
              </div>}



            {!isLoading && !error && filteredNFTs.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl bg-muted py-20 px-6">
                <Package className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  No assets found matching these filters.
                </p>
              </div>
            )}

            {!isLoading && !error && filteredNFTs.length > 0 && <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredNFTs.map((nft, i) => (
                  <NFTCard key={Number(nft.saleDetails.nftId)} nft={nft} index={i} />
                ))}
              </motion.div>}
          </div>
        </div>
  )
}

export default MarketListingsDisplay