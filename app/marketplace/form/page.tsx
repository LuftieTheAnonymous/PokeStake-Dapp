import MarketPlaceForm from "@/components/nft-marketplace/MarketPlaceForm";


const CreateListing = () => {


  return (
    <div className="min-h-screen">
      <div className="container px-4 py-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            List your asset.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set a fixed price in ETH or SNORLIE. No auctions, no waiting.
          </p>
        </div>

        <MarketPlaceForm />
      </div>
    </div>
  );
};

export default CreateListing;
