"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
;

const ETH_USD = 3200;
const SNORLIE_USD = 0.42;

const CreateListing = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [collection, setCollection] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState<Currency>("ETH");
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const usdEstimate = price
    ? (parseFloat(price) * (currency === "ETH" ? ETH_USD : SNORLIE_USD)).toFixed(2)
    : null;

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

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
<div
  className={`relative gap-4 flex flex-col items-center  justify-center h-72 overflow-y-auto rounded-xl border border-primary px-8 py-10 cursor-pointer transition-colors duration-150`}
>
  {mockNFTs.map((mockNft) => (
    <div
      key={mockNft.id}
      id={mockNft.id}
      className="w-full h-32 flex items-center gap-2 justify-between rounded-md p-2 bg-secondary border-primary border">
       
       <div className="flex items-center gap-1">
        <Image alt={mockNft.id} src={mockNft.image} className="" width={64} height={64}  />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold">{mockNft.name}</p>
          <p className="text-xs">{mockNft.collection}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs">ID: {mockNft.id.padStart(4, "0")}</p>
          <p>
        </div>

       </div>
        </div>
  ))}
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
                      <Coins className="h-3.5 w-3.5" />
                      ETH
                    </span>
                  </SelectItem>
                  <SelectItem value="SNORLIE">
                    <span className="flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5" />
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
