"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircleIcon, Loader2, Package } from "lucide-react";
import NFTCard from "@/components/nft-marketplace/Listing";
import FilterSidebar, { type SortOption } from "@/components/nft-marketplace/FIlterSideBar";
import { SaleListing, type Currency } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
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
  const [skipIndex, setSkipIndex] = useState<number>(0);
  
  const {data, isLoading, error} = useQuery({
    queryKey:["pokeCards-marketplace"],
    queryFn: async ()=>{
      const requestPokeListings = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/listings/find-all`, {
        method:'POST',
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          where:undefined,
          take:10,
          skip:skipIndex,
        })
      });

      if(!requestPokeListings.ok){
        throw new Error("Failed to fetch pokecards for marketplace");
      }

      const {data, error }= await requestPokeListings.json();

      if(error){
        throw new Error(error);
      }
      
      return data;
    }
  });


  const filteredNFTs = useMemo(() => {
    let result = data && data.length > 0 ? data : [];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((nft:SaleListing) =>
          nft.pokemonListed.name.toLowerCase().includes(q) ||
          nft.pokemonListed.name.toLowerCase().includes(q)
      );
    }

    // Currency filter
    if (currency !== "ALL") {
      result = result.filter((nft:SaleListing) => currency === 'ETH' ? nft.isPriceInETH : !nft.isPriceInETH);
    }

    // Price range
    if (minPrice) {
      result = result.filter((nft:SaleListing) => Number(nft.isPriceInETH) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((nft:SaleListing) => Number(nft.isPriceInETH) <= parseFloat(maxPrice));
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a:SaleListing, b:SaleListing) => Number(a.isPriceInETH) - Number(b.isPriceInETH));
        break;
      case "price-desc":
        result.sort((a:SaleListing, b:SaleListing) => Number(b.isPriceInETH) - Number(a.isPriceInETH));
        break;
      case "recent":
      default:
        result.sort((a:SaleListing, b:SaleListing) => Number(b.listedAtBlock) - Number(a.listedAtBlock));
        break;
    }

    return result;
  }, [data, currency, sort, minPrice, maxPrice, searchQuery]);


  return (
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 mt-4">
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
                {filteredNFTs.map((nft:SaleListing, i:number) => (
                  <NFTCard key={Number(nft.pokeCardNftId)} nft={nft} index={i} />
                ))}
              </motion.div>}
          </div>
        </div>
  )
}

export default MarketListingsDisplay