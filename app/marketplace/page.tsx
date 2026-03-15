"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import NFTCard from "@/components/nft-marketplace/Listing";
import FilterSidebar, { type SortOption } from "@/components/nft-marketplace/FIlterSideBar";
import { mockNFTs, type Currency } from "@/data/mockNFTs";

import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const Browse = () => {
  const [currency, setCurrency] = useState<"ALL" | Currency>("ALL");
  const [sort, setSort] = useState<SortOption>("recent");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNFTs = useMemo(() => {
    let result = [...mockNFTs];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (nft) =>
          nft.name.toLowerCase().includes(q) ||
          nft.collection.toLowerCase().includes(q)
      );
    }

    // Currency filter
    if (currency !== "ALL") {
      result = result.filter((nft) => nft.currency === currency);
    }

    // Price range
    if (minPrice) {
      result = result.filter((nft) => nft.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((nft) => nft.price <= parseFloat(maxPrice));
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "recent":
      default:
        result.sort((a, b) => b.listedAt.getTime() - a.listedAt.getTime());
        break;
    }

    return result;
  }, [currency, sort, minPrice, maxPrice, searchQuery]);

  return (
    <div className="min-h-screen">
  <GradientBackground />
      <Navigation />
      <div className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Browse Marketplace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fixed-price assets in ETH or SNORLIE. No auctions, no waiting.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-4">
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
            {filteredNFTs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-muted py-20 px-6">
                <Package className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  No assets found matching these filters.
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {filteredNFTs.map((nft, i) => (
                  <NFTCard key={nft.id} nft={nft} index={i} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
