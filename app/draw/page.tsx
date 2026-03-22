import { Sparkles } from "lucide-react";
import CardDrawDisplay from "@/components/draw/CardDrawDisplay";

export default function DrawPage() {


  return (
    <div className="min-h-screen relative">

      <main className="relative">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Card Gacha</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Draw Your Cards</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Draw Daily a Pokemon Card and Explore The Magical World Of PokeStake ! 
            </p>
          </div>

          <CardDrawDisplay/>

        </div>
      </main>
    </div>
  );
}
