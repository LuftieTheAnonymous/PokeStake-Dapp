"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Coins, Layers, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { mockNFTs } from "@/data/mockNFTs";

const ETH_USD = 3200;
const SNORLIE_USD = 0.42;

const NFTDetail = () => {
  const { listingId:id } = useParams<{ listingId: string }>();
  const nft = mockNFTs.find((n) => n.id === id);

  if (!nft) {
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

  const usdPrice = (
    nft.price * (nft.currency === "ETH" ? ETH_USD : SNORLIE_USD)
  ).toFixed(2);

  return (
    <div className="min-h-screen">
        <GradientBackground />
      <Navigation />
    
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
                src={nft.image}
                alt={nft.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {nft.collection}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mt-1">
                  {nft.name}
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
                    {nft.price}
                  </span>
                  <Badge
                    variant={nft.currency === "SNORLIE" ? "default" : "secondary"}
                    className={`text-xs px-2 py-0.5 font-mono ${
                      nft.currency === "SNORLIE"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    {nft.currency}
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
                    {nft.creator}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Listed</span>
                  <span className="text-foreground ml-auto">
                    {nft.listedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Token ID</span>
                  <span className="font-mono text-xs text-foreground ml-auto">
                    #{nft.id.padStart(6, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-8">
               <Button size="lg" className="bg-gradient-to-r w-full cursor-pointer from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg p-6 shadow-lg">
                  <Coins className="h-5 w-5" />
                Buy Now for {nft.price} {nft.currency}
                </Button>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NFTDetail;
