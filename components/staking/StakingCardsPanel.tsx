"use client";

import { useState } from "react";
import { PokeCard } from "@/components/pokemon-card";
import { Button } from "@/components/ui/button";
import usePokeData from "@/hooks/usePokeData";
import { BlockchainEvent, PokemonCard, Rarity, RARITY_CONFIG } from "@/lib/types";
import { TokenBalance, PokeCoinIcon } from "@/components/token-balance";
import { 
  Layers, 
  Ghost, 
  TrendingUp, 
  Clock, 
  Lock, 
  Unlock,
  Sparkles,
  Loader2Icon
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { pinata } from "@/utils/PinataConfig";
import { useBlockNumber, useWatchContractEvent } from "wagmi";
import { CustomConnectButton } from "@/components/custom-connect-button";
import { pokeCardCollectionAbi, pokeCardCollectionAddress } from "@/contracts-abis/PokeCardCollection";
import { pokemonStakingAddress } from "@/contracts-abis/PokemonStaking";
import { toast } from "sonner";


type Props = {}

function StakingCardsPanel({}: Props) {

  const {
    walletAddress,
    stakeCard,
    unstakeCard,
    claimRewards,
    snorliesBalance,
    isConnected,
    userGeneratedCards,
    APYinToken,
    stakingRewardToClaim,
    userStakedPokeCards,
    ownedPokeCards,
    calculateRewards,
    approveToStakingProtocol
  } = usePokeData();

  const [selectedTab, setSelectedTab] = useState<"stake" | "staked">("stake");
  const [approved, setApproved]=useState<boolean>();
  const {data:blockNumber}=useBlockNumber();

  useWatchContractEvent({
    abi:pokeCardCollectionAbi,
    address: pokeCardCollectionAddress,
    eventName:'Approval',
    onError(error) {
      console.log(error);
      toast.error(error.message);
    },
    onLogs(logs){
      if((logs[0] as BlockchainEvent).args.owner === walletAddress && (logs[0] as BlockchainEvent).args.approved === pokemonStakingAddress){
        setApproved(true);
        toast.success("Approval commited successfully !");
      }
    }
  });
  

 const {data:pokemonCards, isLoading, error}=useQuery({
  queryKey:["NFTies-staked", selectedTab, walletAddress], 
  queryFn: async () => {

    let nftCards: {card: PokemonCard, isStaked: boolean, stakedAtBlock:bigint}[] = [];
    
    const sourceCards = selectedTab === 'staked' ? userStakedPokeCards : userGeneratedCards;
    
    if (!sourceCards || sourceCards.length === 0) {
      return nftCards;
    }

    for (let index = 0; index < sourceCards.length; index++) {
      const pokeCard = sourceCards[index];
      
      try {
        const pinataFoundElement = await pinata.gateways.public.get(pokeCard.pinataId);
        
        if (pinataFoundElement.data) {
          nftCards.push({
            card: pinataFoundElement.data as unknown as PokemonCard,
            stakedAtBlock: pokeCard.stakedAtBlock || BigInt(0),
            isStaked: selectedTab === 'staked'
          });
        }
      } catch (err) {
        console.error(`Failed to fetch card ${pokeCard.pinataId}:`, err);
      }
    }
  
    return nftCards;
  },
  enabled: typeof selectedTab !== 'undefined' && walletAddress && walletAddress.length > 0, 
  retry: 5, 
  refetchInterval: 10000, 
  refetchIntervalInBackground: true
});

  const handleStake = (tokenId:bigint) => {
    stakeCard(tokenId);
  };

  const handleUnstake = (tokenId:bigint) => {
    unstakeCard(tokenId);
  };

  const handleClaimRewards = () => {
  claimRewards();
  };

  const getTimeRemaining = (lockTime: bigint) => {
    if(!blockNumber) return "could not calculate";

    const remaining = Number((lockTime + BigInt(7200))- blockNumber) * 12;
    
    const remainingHours = Math.floor(remaining / 60 / 60);

    const remaingMinutes =  Math.floor(((remaining / 60 / 60) - remainingHours) * 60)
    

    if (remaining <= 0) return null;
    
    
    return `${remainingHours}:${remaingMinutes} Left`;
  };


  return (
    <>
            {!isConnected ? (
                /* Connect Wallet Prompt */
                <div className="max-w-md mx-auto text-center space-y-6 py-16">
                  <div className="inline-flex p-6 rounded-full bg-secondary/50 border border-border">
                    <Ghost className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
                    <p className="text-muted-foreground">
                      Connect your wallet to start staking
                    </p>
                  </div>
                <CustomConnectButton />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Stats Dashboard */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <PokeCoinIcon size={20} />
                        </div>
                        <span className="text-muted-foreground text-sm">Balance</span>
                      </div>
                      <TokenBalance amount={snorliesBalance} size="lg" showLabel={true} />
                    </div>
    
                    <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                          <TrendingUp className="h-5 w-5 text-accent" />
                        </div>
                        <span className="text-muted-foreground text-sm">Accrued Rewards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PokeCoinIcon size={28} />
                        <span className="font-mono text-2xl font-bold text-green-500">+{calculateRewards.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">$SNORLIE</span>
                      </div>
                    </div>
    
                    <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="text-muted-foreground text-sm">Average APY</span>
                      </div>
                      <div className="font-mono text-2xl font-bold text-green-500">
                        {APYinToken.toFixed(2)} SNORLIEs
                      </div>
                    </div>
    
                    <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Layers className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-muted-foreground text-sm">Staked Cards</span>
                      </div>
                      <div className="font-mono text-2xl font-bold">
                        {userStakedPokeCards.length}
                        <span className="text-sm text-muted-foreground ml-1">/ {ownedPokeCards + userStakedPokeCards.length}</span>
                      </div>
                    </div>
                  </div>
    
                  {/* Claim Rewards Button */}
                  {stakingRewardToClaim > 0 && (
                    <div className="flex justify-center">
                      <Button
                        size="lg"
                        onClick={handleClaimRewards}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 shadow-lg"
                      >
                        <PokeCoinIcon size={20} className="mr-2" />
                        Claim {stakingRewardToClaim.toFixed(2)} $SNORLIE
                      </Button>
                    </div>
                  )}
    
                  {/* Tabs */}
                  <div className="flex items-center justify-center gap-2 p-1 rounded-xl bg-secondary/50 max-w-md mx-auto">
                    <button
                      onClick={() => setSelectedTab("stake")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        selectedTab === "stake"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Unlock className="h-4 w-4" />
                      Available ({userGeneratedCards.length})
                    </button>
                    <button
                      onClick={() => setSelectedTab("staked")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        selectedTab === "staked"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Lock className="h-4 w-4" />
                      Staked ({userStakedPokeCards.length})
                    </button>
                  </div>
    
    
    
    
    
    
    
    
                {/* Cards Grid */}
    {selectedTab === "stake" ? (
      /* Available Cards */
      <div>
     {!isLoading && !error && (!pokemonCards || pokemonCards.length === 0) && 
          <div className="text-center py-16 space-y-4">
            <Ghost className="h-16 w-16 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Cards Available</h3>
              <p className="text-muted-foreground">Draw some cards first to start staking</p>
            </div>
            <Link href="/draw">
              <Button className="bg-primary hover:bg-primary/90">
                <Sparkles className="h-4 w-4 mr-2" />
                Draw Cards
              </Button>
            </Link>
          </div>}
        
        {isLoading && !error && (!pokemonCards || pokemonCards && (pokemonCards as {card: PokemonCard, isStaked: boolean, stakedAtBlock:bigint}[]).length === 0) ? (
          <div className="text-center py-16 space-y-4">
            <Loader2Icon size={64} className="text-primary mx-auto" />
            <div className="space-y-2">
              <p className="text-muted-foreground">Loading PokeCard...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pokemonCards && pokemonCards.map((card) => (
              <div key={card.card.attributes.id} className="space-y-2">
                <PokeCard card={card.card} showStats={false} />
                <Button
                  onClick={() => !approved ? approveToStakingProtocol(BigInt(card.card.attributes.id - 1), setApproved) :  handleStake(BigInt(card.card.attributes.id - 1))}
                  className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                  size="sm"
                >
                  <Lock className="h-4 w-4 mr-1" />
                  {!approved ? "Approve" : "Stake"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : (
      /* Staked Cards */
      <div>
         {!isLoading && !error && (!pokemonCards || pokemonCards.length === 0) && 
          <div className="text-center py-16 space-y-4">
            <Ghost className="h-16 w-16 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Cards Available</h3>
              <p className="text-muted-foreground">Draw some cards first to start staking</p>
            </div>
            <Link href="/draw">
              <Button className="bg-primary hover:bg-primary/90">
                <Sparkles className="h-4 w-4 mr-2" />
                Draw Cards
              </Button>
            </Link>
          </div>}
    
        {isLoading && !error && (!pokemonCards || pokemonCards && (pokemonCards as {card: PokemonCard, isStaked: boolean, stakedAtBlock:bigint}[]).length === 0) ? (
         <div className="text-center py-16 space-y-4">
            <Loader2Icon size={64} className="text-primary mx-auto" />
            <div className="space-y-2">
              <p className="text-muted-foreground">Loading PokeCard...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pokemonCards && pokemonCards.map((stakedCard) => {
              const timeRemaining = getTimeRemaining(stakedCard.stakedAtBlock);
              const isLocked = timeRemaining !== null;
              const timeStaked = blockNumber ? (((Number(blockNumber - stakedCard.stakedAtBlock)*12) / 86400)) : 0;
              
              const currentRewards = timeStaked * RARITY_CONFIG[Object.keys(RARITY_CONFIG).at(Number(stakedCard.card.attributes.rarity as Rarity)) as Rarity].dailyReward;
    
              return (
                <div key={stakedCard.card.attributes.id} className="space-y-2">
                  <div className="relative">
                    <PokeCard card={stakedCard.card} showStats={false} />
                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/90 backdrop-blur-sm border-t border-border/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Earned:</span>
                        <span className="font-mono text-primary">+{currentRewards.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isLocked ? (
                    <div className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono">{timeRemaining}</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleUnstake(BigInt(stakedCard.card.attributes.id))}
                      className="w-full bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30"
                      size="sm"
                    >
                      <Unlock className="h-4 w-4 mr-1" />
                      Unstake
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}
    
                </div>
              )}
    </>
  )
}

export default StakingCardsPanel