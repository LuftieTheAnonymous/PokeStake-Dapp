import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Currency } from "@/data/mockNFTs";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export type SortOption = "recent" | "price-asc" | "price-desc";

interface FilterSidebarProps {
  currency: "ALL" | Currency;
  setCurrency: (v: "ALL" | Currency) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

const FilterSidebar = ({
  currency,
  setCurrency,
  sort,
  setSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  searchQuery,
  setSearchQuery,
}: FilterSidebarProps) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      <div className="rounded-xl bg-card p-5 shadow-card space-y-5">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground mb-4">
            Filters
          </h2>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">Search</Label>
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Currency Toggle */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">Currency</Label>
          <div className="flex rounded-lg bg-muted p-1 gap-1">
            {(["ALL", "ETH", "SNORLIE"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setCurrency(opt)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all duration-150 ${
                  currency === opt
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)" }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">Price Range</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-9 text-sm font-mono tabular-nums"
            />
            <span className="text-muted-foreground text-xs">—</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-9 text-sm font-mono tabular-nums"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">Sort By</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Listed</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      
        <Link href={`/marketplace/form`}>
          <Button size="lg" className="bg-gradient-to-r w-full cursor-pointer from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg p-6 shadow-lg">
                  <CirclePlus className="h-5 w-5 mr-2" />
                  List PokeCard
                </Button>

        </Link>
    </aside>
  );
};

export default FilterSidebar;