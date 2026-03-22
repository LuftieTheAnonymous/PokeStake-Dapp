import { 
  ImageIcon, 
} from "lucide-react";
import PokeCardsOwnerPanel from "@/components/gallery/PokeCardsOwnerPanel";


export default function GalleryPage() {
  return (
    <div className="min-h-screen relative">      
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30">
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm font-medium">NFT Gallery</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Your Collection</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              View all your Pokemon card NFTs in one place
            </p>
          </div>

          <PokeCardsOwnerPanel />
      
        </div>
      </main>
    </div>
  );
}
