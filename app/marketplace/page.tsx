import MarketListingsDisplay from "@/components/nft-marketplace/MarketListingsDisplay";

const Browse = () => {

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Browse Marketplace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fixed-price assets in ETH or SNORLIE. No auctions, no waiting.
          </p>
        </div>

        <MarketListingsDisplay/>
      </div>
    </div>
  );
};

export default Browse;
