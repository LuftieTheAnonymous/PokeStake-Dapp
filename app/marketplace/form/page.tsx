"use client";
import * as z from "zod";
import { useState } from "react";
import {FaEthereum} from "react-icons/fa";
import { Upload, Image as ImageIcon, ArrowLeft, ArrowRight, AlertCircleIcon, Sparkle, LoaderIcon, MessageCircleWarning, UserStar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SnorlieImage from "@/public/snorlie.png"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";
import { mockNFTs, type Currency } from "@/data/mockNFTs";import Image from "next/image";
import { NFTCard } from "@/components/nft-marketplace/NftListElement";
import usePokeData from "@/hooks/usePokeData";
import { useQuery } from "@tanstack/react-query";
import { PokemonCard } from "@/lib/types";
import { pinata } from "@/utils/PinataConfig";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from '@hookform/resolvers/zod';
import { useWatchContractEvent } from "wagmi";
import { pokeCardCollectionAbi, pokeCardCollectionAddress } from "@/contracts-abis/PokeCardCollection";
import { marketPlaceAddress } from "@/contracts-abis/MarketPlace";

const CreateListing = () => {

  const [currency, setCurrency] = useState<Currency>("ETH");
  const [pageStartIndex, setPageStartIndex]=useState<number>(0);
  const [approved, setApproved]=useState<boolean>(false);
  const [loading, setLoading]= useState<boolean>(false);

  const {ethUsdPrice,walletAddress, userGeneratedCards, totalSupply:nftTotalSupply, approveToMarketPlace, listPokeCardOnMarketPlace
  }=usePokeData();

  const formScheme= z.object({
    nftId: z.bigint({
      'message':'Wrong type provided'
    }),
  listingPrice: z.number({
    message:"Wrong type provided"
  }).min(1/1e18,{
    'message':'Listing price cannot be less than 1'
  }),
  isPaidInEth:z.boolean({
    message:"Cannot be other type than boolean"
  })
  }).required();

 type FormInput = z.infer<typeof formScheme>;


  const {
    register, handleSubmit, watch, setValue, formState, setError
  }=useForm<FormInput>({
    resolver: zodResolver(formScheme),
    defaultValues:{
      'isPaidInEth': currency === 'ETH' ? true : false,
      'listingPrice':undefined,
      'nftId':undefined
    }
  });



  const {data, isLoading, error
  }=useQuery({
    queryKey:["NFTies-on-sale", walletAddress],
    queryFn:async()=>{
 let nftCards: {card: PokemonCard, nftId:bigint}[] = [];

   for (let index = 0; index < userGeneratedCards.length; index++) {
      const pokeCard = userGeneratedCards[index];
      
      try {
        const pinataFoundElement = await pinata.gateways.public.get(pokeCard.pinataId);
        
        if (pinataFoundElement.data) {
          nftCards.push({
            card: pinataFoundElement.data as unknown as PokemonCard,
            nftId: pokeCard.nftId
          });
        }
      } catch (err) {
        console.error(`Failed to fetch card ${pokeCard.pinataId}:`, err);
      }
    }

    return nftCards;
    },
  enabled: walletAddress && walletAddress.length > 0, 
  retry: 5, 
  refetchInterval: 10000, 
  refetchIntervalInBackground: true
  });

  const usdEstimate = watch('listingPrice')
    ? ((watch('listingPrice')) * (currency === "ETH" ? ethUsdPrice : 0.24)).toFixed(2)
    : null;


      useWatchContractEvent({
        abi:pokeCardCollectionAbi,
        address: pokeCardCollectionAddress,
        eventName:'Approval',
        onError(error) {
          console.log(error);
        },
        onLogs(logs){
          if((logs[0] as any).args.owner === walletAddress && (logs[0] as any).args.approved === marketPlaceAddress){
            setApproved(true);
            setLoading(false);
            toast.success("Approval commited successfully !");
          }
        }
      });
      

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

        <form onSubmit={handleSubmit(async (data,event)=>{
          console.log(data);
          listPokeCardOnMarketPlace(data.nftId, BigInt(data.listingPrice * 1e18), data.isPaidInEth, setLoading);
        },(error)=>{
          console.log(error);
          setLoading(false);
          toast.error(error.root?.message);
        })

        } className="space-y-6">
          {/* Dropzone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">PokeCards Owned</Label>
<div className={`relative gap-4 flex shadow-lg shadow-primary/60 flex-col items-center max-h-80 h-full justify-center px-4 py-8 rounded-lg border border-primary cursor-pointer transition-colors duration-150`}>
  {data && !isLoading && data.length > 0 && data.slice(pageStartIndex, pageStartIndex + 3).map((mockNft) => (
  <NFTCard nftId={mockNft.nftId} {...register('nftId')}
  onClick={()=>{setValue('nftId',(mockNft.nftId)
  )}} nft={mockNft.card} key={Number(mockNft.nftId)} 
  selected={watch('nftId') === mockNft.nftId}
  />
  ))}
  {data && !isLoading && data.length === 0 && <>
    <AlertCircleIcon size={24} className="text-primary text-4xl"/>
    <p className="text-primary font-medium">No PokeCards have been found please checkout</p>
    <Button onClick={(e)=>{
      e.preventDefault();
      redirect("/draw");
    }} size="sm" className="bg-gradient-to-r cursor-pointer mt-3 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-6  shadow-lg">
                <Sparkle />
                  Draw First Card
                </Button>
    </>}

    {isLoading && !error && <>
    <LoaderIcon className="text-xl text-primary"/>
    <p>Loading...</p>
    </>}

    {error && !isLoading && <>
    <MessageCircleWarning className="text-primary text-xl"/>
    <p>Error occured: {error.message}</p>
    </>}
</div>



<div className="flex mt-5  sm:flex-row flex-col items-center gap-2 justify-center">

             <Button disabled={pageStartIndex <= 0 || data?.length === 0 || data && data.length < 3 } onClick={(e)=>{
              e.preventDefault();
              if(pageStartIndex > 0) setPageStartIndex(pageStartIndex - 3);
             }} size="lg" className="bg-gradient-to-r cursor-pointer mt-3 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-6 max-w-32 w-full shadow-lg">
                <ArrowLeft className="h-4 w-4 mr-2"  />
                  Previous
                </Button>

             <Button disabled={pageStartIndex >= mockNFTs.length - 3 || data && data.length < 3 } onClick={(e)=>{
              e.preventDefault();
              if(pageStartIndex < mockNFTs.length - 3) setPageStartIndex(pageStartIndex + 3);
             }} size="lg" className="bg-gradient-to-r cursor-pointer mt-3 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-6 max-w-32 w-full shadow-lg">
                  Next
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
</div>
          </div>
         

          {/* Pricing */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Price</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.0001"
                min="0"
                placeholder="0.00"
                onChange={(e) => 
                  setValue('listingPrice', Number(e.target.value))
                }
                className="flex-1 font-mono tabular-nums"
                required
              />
              <Select value={currency} onValueChange={(v) =>{
                setCurrency(v as Currency);
                if(v === 'ETH'){
                  setValue('isPaidInEth', true);
                }else{
                  setValue('isPaidInEth', false);
                }
              }
               }>
                <SelectTrigger
                className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">
                    <span className="flex items-center gap-1.5">
                      <FaEthereum className="h-4 w-4" />
                      ETH
                    </span>
                  </SelectItem>
                  <SelectItem value="SNORLIE">
                    <span className="flex items-center gap-1.5">
                      <Image src={SnorlieImage} className="h-4 w-4" alt="" width={16} height={16} />
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

{!approved ?  <Button onClick={(e)=>{
  e.preventDefault();
  if(!watch('nftId')){
    setError('nftId', {'message':'No NFT has been selected !'});
    return;
  }
  setLoading(true);
  approveToMarketPlace(watch('nftId'), setLoading);
}} size="lg" className="bg-gradient-to-r cursor-pointer mt-3 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-6 w-full shadow-lg">
                <Check className="h-4 w-4 mr-2" />
                  {loading ? "Approving..." : "Approve"}
                </Button> : 
                 <Button type="submit" size="lg" className="bg-gradient-to-r cursor-pointer mt-3 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-6 w-full shadow-lg">
                <Upload className="h-4 w-4 mr-2" />
                  {loading ? "Listing..." : "List Your NFT"}
                </Button> }

          
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
