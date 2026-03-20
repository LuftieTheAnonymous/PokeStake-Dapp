"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Coins, Layers, CornerDownLeft, LoaderIcon, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Currency, PokemonCard, SaleListing } from "@/lib/types";
import { readContract } from '@wagmi/core';
import { config } from "@/lib/wagmi/wagmiConfig";
import { marketPlaceAbi, marketPlaceAddress } from "@/contracts-abis/MarketPlace";
import {PaymentDialog} from "@/components/nft-marketplace/ListingExtensionDialog";
import { pinata } from "@/utils/PinataConfig";
import { useMemo } from "react";
import usePokeData from "@/hooks/usePokeData";


const NFTDetail = () => {
  const {ethUsdPrice,walletAddress,delistPokeCard,  purchasePokeCard}=usePokeData();

  const { listingId } = useParams<{ listingId: string }>();

  const {data, isLoading, error} = useQuery({queryKey:["listing", listingId], queryFn:async()=>{
   
    let nftCard: {saleDetails?: SaleListing, card?:PokemonCard}={saleDetails:undefined, card:undefined};
   
  const pokeCard:SaleListing = await readContract(config, {abi:marketPlaceAbi, address:marketPlaceAddress, functionName:"getListing", args:[listingId]}) as SaleListing;
   
  if(!pokeCard){
    return undefined;
  }
   
         const httpsInitial= `https://${process.env.NEXT_PUBLIC_API_ENDPOINT}/ipfs/`;
   
         const cid = pokeCard.tokenURI.slice(httpsInitial.length);
   
         try {
           const pinataFoundElement = await pinata.gateways.public.get(cid);
           
           if (pinataFoundElement.data) {
             nftCard = {
               saleDetails: {...pokeCard, tokenURI:cid},
               card: pinataFoundElement.data as unknown as PokemonCard,
             };
           }
         } catch (err) {
           console.error(`Failed to fetch card ${pokeCard.listingId}:`, err);
         }

         console.log(nftCard)

         return nftCard;
       
  }});

    const usdPrice = useMemo(()=>{
    return data && data.saleDetails && data.card ? ((Number(data.saleDetails.listingPrice) / Number(1e18)) * (data.saleDetails.isPriceInEth ? ethUsdPrice : 0.5)).toFixed(2) : 0;
  },[data]);


  if (!data && !isLoading && error) {
    return (
      <div className="min-h-screen bg-background">
      <GradientBackground />
      <Navigation />

        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">NFT not found.</p>
          <Link href="/marketplace">
            <Button variant="outline" className="mt-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    );
  }


  if (!data && isLoading && !error) {
    return (
      <div className="min-h-screen">
      <GradientBackground />
      <Navigation />

        <div className="container mx-auto flex flex-col gap-2 items-center px-4 py-20 text-center">
          <LoaderIcon size={48} className="text-primary text-4xl"/>
          <p className="text-muted-primary text-lg font-bold">Loading...</p>
        </div>
      </div>
    );
  }


    

  return (
    <div className="min-h-screen">
        <GradientBackground />
      <Navigation />
    {data && data.card && data.saleDetails &&
      <div className="container px-4 py-6 max-w-5xl mx-auto">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Image */}
          <div className="rounded-xl bg-card p-2 shadow-card">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={data.card.image}
                alt={data.card.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm capitalize text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {data.card.attributes.type.join(" / ")}
                </p>
                <h1 className="text-2xl capitalize font-semibold tracking-tight text-foreground mt-1">
                  {data.card.name}
                </h1>
              </div>

              <Separator />

              {/* Price */}
              <div className="rounded-xl bg-muted/60 p-5 space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Fixed Price
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                    {(Number(data.saleDetails.listingPrice) / Number(1e18)).toFixed(5)}
                  </span>
                  <Badge
                    variant={!data.saleDetails.isPriceInEth ? "default" : "secondary"}
                    className={`text-xs px-2 py-0.5 font-mono ${
                      !data.saleDetails.isPriceInEth
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    {!data.saleDetails.isPriceInEth ? "SNORLIE" : "ETH"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono tabular-nums">
                  ≈ ${Number(usdPrice).toLocaleString()} USD
                </p>
              </div>

              <Separator />

              {/* Metadata */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Creator</span>
                  <span className="font-mono text-xs text-foreground ml-auto">
                    {data.saleDetails.listingOwner}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Listed At Block</span>
                  <span className="text-foreground ml-auto">
                    {Number(data.saleDetails.listingBlockNumber)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Token ID</span>
                  <span className="font-mono text-xs text-foreground ml-auto">
                    #{Number(data.saleDetails.nftId).toString().padStart(6, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            {data && data.saleDetails && 
            <div className="mt-8 flex flex-col gap-3">
               <Button onClick={()=>{
                purchasePokeCard((data.saleDetails as SaleListing).listingId as bigint, (data.saleDetails as SaleListing).listingPrice, (data.saleDetails as SaleListing).isPriceInEth)
               }} size="lg" className="bg-gradient-to-r w-full cursor-pointer from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg p-6 shadow-lg">
                  <Coins className="h-5 w-5" />
                Buy Now for {(Number(data.saleDetails.listingPrice) / Number(1e18)).toFixed(5)} {data.saleDetails.isPriceInEth ? 'ETH' : 'SNORLIE'}
                </Button>

               {walletAddress === data.saleDetails.listingOwner && 
                <div className="flex flex-col justify-center w-full gap-2 sm:flex-row items-center">
              
        <PaymentDialog listingId={(data.saleDetails as SaleListing).listingId} triggerText='Extend Listing-Time' />

                 <Button onClick={()=>{
                delistPokeCard((data.saleDetails as SaleListing).listingId as bigint);
               }} size="lg" className="bg-red-500 w-full sm:w-1/2 cursor-pointer from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg p-6 shadow-lg">
                  <CornerDownLeft size={24} />
                Delist PokeCard
                </Button>
              
                </div>
               }
            </div>
            }
        
          </div>
        </motion.div>
      </div>
}

    </div>
  );
};

export default NFTDetail;
