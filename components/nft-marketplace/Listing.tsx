import  Link  from "next/link";
import { motion } from "framer-motion";
import { Tag, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NFTItem } from "@/data/mockNFTs";

interface ListingProps {
  nft: NFTItem;
  index?: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.3 } },
};

const Listing = ({ nft, index = 0 }: ListingProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/listing/${nft.id}`}
        className="group relative block border rounded-xl bg-card p-2 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer"
      >
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={nft.image}
            alt={nft.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="mt-3 space-y-1.5 px-1 pb-1">
          <p className="text-xs text-muted-foreground">{nft.collection}</p>
          <h3 className="text-sm font-semibold tracking-tight text-foreground truncate">
            {nft.name}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-sm font-medium tabular-nums tracking-tight text-foreground">
                {nft.price}
              </span>
              <Badge
                variant={nft.currency === "SNORLIE" ? "default" : "secondary"}
                className={`text-[10px] px-1.5 py-0 h-5 font-mono ${
                  nft.currency === "SNORLIE"
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
              >
                {nft.currency}
              </Badge>
            </div>
          </div>


                <Button size="sm" className="bg-gradient-to-r w-full cursor-pointer from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-5 mt-2 shadow-lg">
              <Coins className="h-3.5 w-3.5 mr-1.5" />
            Buy Now
                </Button>
         
        </div>
      </Link>
    </motion.div>
  );
};

export default Listing;
