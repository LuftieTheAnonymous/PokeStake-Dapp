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
import MarketplaceNav from "@/components/nft-marketplace/MarketPlaceNav";
import { useToast } from "@/hooks/use-toast";
import type { Currency } from "@/data/mockNFTs";

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
    <div className="min-h-screen bg-background">
      <MarketplaceNav />
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
            <Label className="text-sm font-medium">Asset</Label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFile(file);
                };
                input.click();
              }}
              className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed p-12 cursor-pointer transition-colors duration-150 ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/50 hover:border-muted-foreground/30"
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-lg object-contain"
                />
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground tracking-wide">
                    Upload Asset
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag & drop or click to browse
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Inferno Drake #042"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Collection */}
          <div className="space-y-2">
            <Label htmlFor="collection" className="text-sm font-medium">Collection</Label>
            <Input
              id="collection"
              placeholder="e.g. Elemental Beasts"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            />
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

          <Button type="submit" size="lg" className="w-full font-semibold">
            <Upload className="h-4 w-4 mr-2" />
            Complete Listing
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
