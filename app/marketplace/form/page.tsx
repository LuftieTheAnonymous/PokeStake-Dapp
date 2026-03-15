"use client";

import { useState } from "react";
import {FaEthereum} from "react-icons/fa";
import { Upload, Image as ImageIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SnorlieImage from "@/public/snorlie.png"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { useToast } from "@/hooks/use-toast";
import { mockNFTs, type Currency } from "@/data/mockNFTs";import Image from "next/image";
import { NFTCard } from "@/components/nft-marketplace/NftListElement";
;

const ETH_USD = 3200;
const SNORLIE_USD = 0.42;

const CreateListing = () => {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<Currency>("ETH");
  const [pageStartIndex, setPageStartIndex]=useState<number>(0);

  const usdEstimate = price
    ? (parseFloat(price) * (currency === "ETH" ? ETH_USD : SNORLIE_USD)).toFixed(2)
    : null;

  


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Listing created",
      description: `${name} listed for ${price} ${currency}`,
    });
  };

  return (
    <div className="min-h-screen">
      <GradientBackground />
      <Navigation />
      <div className="container px-4 py-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            List your asset.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set a fixed price in ETH or SNORLIE. No auctions, no waiting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropzone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">PokeCards Owned</Label>
<div className={`relative gap-4 flex shadow-lg shadow-primary/60 flex-col items-center max-h-80 h-full justify-center px-4 py-8 rounded-lg border border-primary cursor-pointer transition-colors duration-150`}>
  {mockNFTs.slice(pageStartIndex, pageStartIndex + 3).map((mockNft) => (
  <NFTCard nft={mockNft} key={mockNft.id} />
  ))}
</div>

<div className="flex mt-5  sm:flex-row flex-col items-center gap-2 justify-center">

             <Button disabled={pageStartIndex <= 0 } onClick={(e)=>{
              e.preventDefault();
              if(pageStartIndex > 0) setPageStartIndex(pageStartIndex - 3);
             }} size="lg" className="bg-gradient-to-r cursor-pointer mt-3 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-6 max-w-32 w-full shadow-lg">
                <ArrowLeft className="h-4 w-4 mr-2"  />
                  Previous
                </Button>

             <Button disabled={pageStartIndex >= mockNFTs.length - 3} onClick={(e)=>{
              e.preventDefault();
              if(pageStartIndex < mockNFTs.length - 3) setPageStartIndex(pageStartIndex + 3);
             }} size="lg" className="bg-gradient-to-r cursor-pointer mt-3 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-6 max-w-32 w-full shadow-lg">
                  Next
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
</div>
          </div>
         
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your asset..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Price</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 font-mono tabular-nums"
                required
              />
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">
                    <span className="flex items-center gap-1.5">
                      <FaEthereum className="h-4 w-4" />
                      ETH
                    </span>
                  </SelectItem>
                  <SelectItem value="SNORLIE">
                    <span className="flex items-center gap-1.5">
                      <Image src={SnorlieImage} className="h-4 w-4" alt="" width={16} height={16} />
                      SNORLIE
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {usdEstimate && (
              <p className="text-xs text-muted-foreground font-mono tabular-nums">
                ≈ ${Number(usdEstimate).toLocaleString()} USD
              </p>
            )}
          </div>

             <Button size="lg" className="bg-gradient-to-r cursor-pointer mt-3 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-6 w-full shadow-lg">
                <Upload className="h-4 w-4 mr-2" />
                  Complete Listing
                </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
