import StakingCardsPanel from "@/components/staking/StakingCardsPanel";
import { 
  Layers 
} from "lucide-react";


export default function StakingPage() {

  return (
    <div className="min-h-screen relative">
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/30">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">Staking Protocol</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Stake & Earn</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Stake your Pokemon cards to earn $SNORLIE tokens. 
              Cards are locked for 24 hours after staking.
            </p>
          </div>

  <StakingCardsPanel />
        </div>
      </main>
    </div>
  );
}
