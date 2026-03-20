'use client';

import { snorlieCoinABI, snorlieCoinContractAddress } from "@/contracts-abis/SnorlieCoin";
import { type PokemonCard, type Rarity, SaleListing, pokemonAmountModulator, rarityModulator } from "../lib/types";
import { useAccount, useBlockNumber, useReadContracts, useWriteContract } from 'wagmi'
import { useMemo } from "react";
import { pokeCardCollectionAbi, pokeCardCollectionAddress } from "@/contracts-abis/PokeCardCollection";
import {PokemonClient} from "pokenode-ts";
import { VRFConsumerAbi, VrfConsumerAddress } from "@/contracts-abis/VRFConsumer";
import { config } from "../lib/wagmi/wagmiConfig";
import { pokemonStakingAbi, pokemonStakingAddress } from "@/contracts-abis/PokemonStaking";
import { pinata } from "@/utils/PinataConfig";
import { readContract } from '@wagmi/core';
import { marketPlaceAbi, marketPlaceAddress } from "@/contracts-abis/MarketPlace";
import { vrfCoordinatorAddress } from "@/contracts-abis/VRFCoordinator";

function usePokeData() {
const pokemonClient = new PokemonClient();
  const {address, isConnected, isConnecting}= useAccount();
  const {writeContract}=useWriteContract();
  const {data:blockNumber}=useBlockNumber();
const {data} = useReadContracts({
  contracts: [
    // [0] - snorlieCoin balanceOf
    { abi: snorlieCoinABI, address: snorlieCoinContractAddress, functionName: "balanceOf", args: [address] },
    // [1] - pokeCardCollection totalSupply
    { abi: pokeCardCollectionAbi, address: pokeCardCollectionAddress, functionName: "totalSupply", args: [] },
    // [2] - pokeCardCollection getGeneratedCards
    { abi: pokeCardCollectionAbi, address: pokeCardCollectionAddress, functionName: "getGeneratedCards", args: [address] },
    // [3] - pokeCardCollection getTotalCardsGenerated
    { abi: pokeCardCollectionAbi, address: pokeCardCollectionAddress, functionName: "getTotalCardsGenerated", args: [address] },
    // [4] - pokeCardCollection getLastTimeGenerated
    { abi: pokeCardCollectionAbi, address: pokeCardCollectionAddress, functionName: "getLastTimeGenerated", args: [address] },
    // [5] - pokemonStaking getRewardAmount
    { abi: pokemonStakingAbi, address: pokemonStakingAddress, functionName: "getRewardAmount" },
    // [6] - pokemonStaking calculateAPY
    { abi: pokemonStakingAbi, address: pokemonStakingAddress, functionName: "calculateAPY" },
    // [7] - pokemonStaking calculateRewards
    { abi: pokemonStakingAbi, address: pokemonStakingAddress, functionName: "calculateRewards", args: [address] },
    // [8] - pokeCardCollection balanceOf
    { abi: pokeCardCollectionAbi, address: pokeCardCollectionAddress, functionName: "balanceOf", args: [address] },
    // [9] - pokemonStaking getStakedPositions
    { abi: pokemonStakingAbi, address: pokemonStakingAddress, functionName: "getStakedPositions", args: [address] },
    // [14] - VRFConsumer getRequestId
    { abi: VRFConsumerAbi, address: VrfConsumerAddress, functionName: "getRequestId", args:[address]},
    // [11]
    {abi: VRFConsumerAbi, address:VrfConsumerAddress, functionName:"getRequestData", args:[address, pokemonAmountModulator, rarityModulator]},
    // [12]
    {abi: VRFConsumerAbi, address: vrfCoordinatorAddress, functionName:"getRequestDataArray", args:[address]},
    // 13
    {abi: marketPlaceAbi, address: marketPlaceAddress, functionName:"getLatestEthUsdPrice"},
    // 14
    {'abi':marketPlaceAbi, address:marketPlaceAddress, functionName:"getListings"}
  
  ],
  account: address,
  query: { enabled: typeof address === 'string',retry:5, refetchInterval:100000, refetchIntervalInBackground:true, 
  'refetchOnReconnect':false, 'refetchOnMount':true }
});

// Now the corrected useMemo hooks:
const snorliesBalance = useMemo(() => {
  return data && data[0].result ? Number((data[0].result as bigint) / BigInt(1e18)) : 0;
}, [data]);

const totalSupply = useMemo(() => {
  return data && data[1].result ? Number(data[1].result) : 0;
}, [data]);

const userGeneratedCards = useMemo(() => {
  return data && data[2].result ? (data[2].result as any[]) : [];
}, [data]);

const userTotalGeneratedCards = useMemo(() => {
  return data && data[3].result ? Number(data[3].result) : 0;
}, [data]);

const lastBlockGeneratedAt = useMemo(() => {
  return data && data[4].result ? Number(data[4].result) : 0;
}, [data]);

const stakingRewardToClaim = useMemo(() => {
  return data && data[5].result ? Number((data[5].result as bigint) / BigInt(1e18)) : 0;
}, [data]);

const APYinToken = useMemo(() => {
  return data && data[6].result ? Number((data[6].result as bigint) / BigInt(1e18)) : 0;
}, [data]);

const calculateRewards = useMemo(() => {
  return data && data[7].result ? Number((data[7].result as bigint) / BigInt(1e18)) : 0;
}, [data]);

const ownedPokeCards = useMemo(() => {
  return data && data[8].result ? Number((data[8].result as bigint) / BigInt(1e18)) : 0;
}, [data]);

const userStakedPokeCards = useMemo(() => {
  return data && data[9].result ? (data[9].result as any[]) : [];
}, [data]);

const requestId = useMemo(() => {
  return data && data[10].result ? data[10].result as bigint : BigInt(0);
}, [data]);

const requestData=useMemo(()=>{
  let requestRecent = data && data[11].result ? data[11].result as [bigint, bigint, boolean] : [BigInt(0), BigInt(0), false] as [bigint, bigint, boolean];
  return {
    pokedexIndex: requestRecent[0],
    rarityLevel:requestRecent[1],
    isResolved: requestRecent[2]
  }
},[data]);

const ethUsdPrice=useMemo(()=>{
  return data && data[13].result && data[13].result !== null ? Number(BigInt(data[13].result as bigint) / BigInt(1e18)) : 0;
},[data])

const requestDataArray = useMemo(()=>{
  return data && data[12].result as unknown as bigint[] ? (data[12].result as unknown as bigint[]) : [];
},[data])

const getListings = useMemo(()=>{
   return data && data[14].result ? data[14].result as SaleListing[] : [];
},[data])

const isElligibleToDraw=useMemo(()=>{

  return (Number(blockNumber) - lastBlockGeneratedAt) > 7200;

},[lastBlockGeneratedAt, blockNumber]);


async function drawRandomNumber(){
 const result = writeContract({
  abi: VRFConsumerAbi,
  address: VrfConsumerAddress,
  functionName:"requestRandomWords",
  args:[],
});

return result as unknown as bigint;
}


function stakeCard(tokenId:bigint){
  writeContract({
    abi:pokemonStakingAbi,
    address:pokemonStakingAddress,
    functionName:"stake",
    args:[tokenId],
  })
}

function unstakeCard(tokenId:bigint){
    writeContract({
    abi:pokemonStakingAbi,
    address:pokemonStakingAddress,
    functionName:"unstake",
    args:[tokenId],
    gas: BigInt(200000)
  })
}

function claimRewards(){
   writeContract({
    abi:pokemonStakingAbi,
    address:pokemonStakingAddress,
    functionName:"claimRewards",
  }) 
}


async function getRandomPokemon() {
try {  

  if(requestId === BigInt(0)) return {card:null, error:"No request has been requested from you"}

  const getRandomValues = await readContract(config, {
    abi:VRFConsumerAbi,
    address:VrfConsumerAddress,
    functionName:"getRequestData",
    args:[address, pokemonAmountModulator, rarityModulator]   
    }) as [bigint, bigint, boolean];

    console.log(getRandomValues);

  const pokemonData = await pokemonClient.getPokemonById(Number(getRandomValues[0]));
  return {card:{
    name: pokemonData.name,
    pokedexIndex: pokemonData.id,
    pokemonRarity:Number(getRandomValues[1]),
    pokemonImage: pokemonData.sprites.front_default,
    sprites: [pokemonData.sprites.front_default, pokemonData.sprites.back_default],
    types: pokemonData.types.map((pokemonType)=>pokemonType.type.name),
    pokemonCry: pokemonData.cries,
    description:`${pokemonData.types.map((pokemonType)=>pokemonType.type.name).length === 2 ? `${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[0]}/${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[1]}` : `${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[0]}`}`,
    hp: pokemonData.stats.find((s) => s.stat.name === "hp")?.base_stat || 50,
    attack: pokemonData.stats.find((s) => s.stat.name === "attack")?.base_stat || 50,
    defense: pokemonData.stats.find((s) => s.stat.name === "defense")?.base_stat || 50,
    
  }, error:null}
} catch (error) {
  console.log(error);
  return {error, card:null} 
}
}


async function drawCard() {
      const pokemon = await getRandomPokemon();
        const rarityMultiplier = {
          common: 1,
          uncommon: 2,
          rare: 3,
          "ultra rare": 4,
        };
        
         if(!pokemon.card) return {card:null, error: pokemon.error ?? "No pokemon card drawn"};

      const selectedKey=Object.keys(rarityMultiplier).at(pokemon.card.pokemonRarity);

      const rarityBoost =rarityMultiplier[selectedKey as Rarity];

      if(!data || typeof data[1].result === 'undefined') throw new Error("Result not found for new Card");

        const newCard: PokemonCard = {
          name: pokemon.card.name,
          image: pokemon.card.pokemonImage as string,
          description: pokemon.card.description,
          attributes:{
          pokedexIndex: pokemon.card.pokedexIndex,
          id: Number(data[1].result as bigint) + 1,
          rarity: selectedKey as Rarity,
          sprites:pokemon.card.sprites,
          type: pokemon.card.types,
          cries: pokemon.card.pokemonCry,
          hp: Math.floor(pokemon.card.hp + (rarityBoost)),
          attack: Math.floor(pokemon.card.attack + rarityBoost),
          defense: Math.floor(pokemon.card.defense + rarityBoost),
          }
        };
      
        return {card:newCard, error:null};
      }


 async function mintDrawnPokemon(drawnPokemonCard:PokemonCard){
  try {

    const storeInPinata = await pinata.upload.public.json(drawnPokemonCard,{
      'metadata':{
      'keyvalues':{stringifiedAttributes:JSON.stringify(drawnPokemonCard.attributes)}}
  });

  if(storeInPinata.cid.trim().length === 0){
    return {error: "CID cannot be equal 0"};
  }
      
        writeContract({
          abi: pokeCardCollectionAbi,
          address:pokeCardCollectionAddress,
          functionName:"generatePokemon",
          args:[`https://${process.env.NEXT_PUBLIC_API_ENDPOINT}/ipfs/${storeInPinata.cid}`, storeInPinata.cid]
        });
  } catch (error) {
    console.log(error, "error while minting");
  }
}


function approveToMarketPlace(tokenId:bigint, updateLoadingState:(state:boolean)=>void){
  writeContract({
    abi: pokeCardCollectionAbi,
    address: pokeCardCollectionAddress,
    functionName:"approve",
    args:[marketPlaceAddress, tokenId],
    gas: BigInt(200_000)
  }, {
    onError(error){
      console.log(error);
      updateLoadingState(false);
    },
    onSuccess(data, variables, onMutateResult, context) {
      console.log(data, variables, onMutateResult, context);
      updateLoadingState(true);
    },
  })

}

function approveToStakingProtocol(tokenId:bigint, updateApprovedState:(value:boolean)=>void){
    writeContract({
    abi: pokeCardCollectionAbi,
    address: pokeCardCollectionAddress,
    functionName:"approve",
    args:[pokemonStakingAddress, tokenId],
    gas: BigInt(200_000)
  }, {
    onError(error){
      console.log(error);
      updateApprovedState(false);
    },
    onSuccess(data, variables, onMutateResult, context) {
      console.log(data, variables, onMutateResult, context);
    },
  })
}

function listPokeCardOnMarketPlace(tokenId:bigint, listingPrice:bigint, isPriceInEth:boolean, updateLoadingState:(value:boolean)=>void){
  writeContract({
    abi: marketPlaceAbi,
    address: marketPlaceAddress,
    functionName:"listPokeCard",
    args:[tokenId, listingPrice, isPriceInEth]
  },{
onError(error, variables, onMutateResult, context) {
  updateLoadingState(false);
},
onSuccess(data, variables, onMutateResult, context) {
  updateLoadingState(true);
},
  });
}

function purchasePokeCard(listingId:bigint, amountToPay:bigint, isEthPrice:boolean){
  writeContract({
    abi: marketPlaceAbi,
    address:marketPlaceAddress,
    functionName:"purchasePokeCard",
    args:[listingId, isEthPrice ? BigInt(0) : amountToPay],
    value: isEthPrice ? amountToPay : undefined
  },{
    onError(error, variables, onMutateResult, context) {
      console.log(error, "ERROR");
      console.log(variables, context);
    },
    onSuccess(data, variables, onMutateResult, context) {
           console.log(data, "DATA");
      console.log(variables, context);
    },
  })
}

function delistPokeCard(listingId:bigint){
  writeContract({
    abi: marketPlaceAbi,
    address:marketPlaceAddress,
    functionName:"delistPokemonCard",
    args:[listingId],
  },{
    onError(error, variables, onMutateResult, context) {
      console.log(error, "ERROR");
      console.log(variables, context);
    },
    onSuccess(data, variables, onMutateResult, context) {
           console.log(data, "DATA");
      console.log(variables, context);
    },
  });
}


function payListingTimeExtensionInEth(listingId:bigint, amount:bigint){
    writeContract({
    abi: marketPlaceAbi,
    address:marketPlaceAddress,
    functionName:"preLongListingTimeInEth",
    args:[listingId],
    value:amount,
  },{
    onError(error, variables, onMutateResult, context) {
      console.log(error, "ERROR");
      console.log(variables, context);
    },
    onSuccess(data, variables, onMutateResult, context) {
           console.log(data, "DATA");
      console.log(variables, context);
    },
  });
}

function payListingTimeExtensionInSnorlies(listingId:bigint, amount:bigint){
    writeContract({
    abi: marketPlaceAbi,
    address:marketPlaceAddress,
    functionName:"preLongListingTimeInSnorlie",
    args:[listingId, amount],
  },{
    onError(error, variables, onMutateResult, context) {
      console.log(error, "ERROR");
      console.log(variables, context);
    },
    onSuccess(data, variables, onMutateResult, context) {
           console.log(data, "DATA");
      console.log(variables, context);
    },
  });
}



return {
  drawCard,
  requestId,
  claimRewards,
  approveToMarketPlace,
  approveToStakingProtocol,
  listPokeCardOnMarketPlace,
  payListingTimeExtensionInEth,
  payListingTimeExtensionInSnorlies,
  requestData,
  getRandomPokemon,
  delistPokeCard,
  snorliesBalance,
  walletAddress: address,
  isConnected,
  isConnecting,
  isElligibleToDraw,
  totalSupply,
  getListings,
  userGeneratedCards,
  userStakedPokeCards,
  stakingRewardToClaim,
  calculateRewards,
  APYinToken,
  ownedPokeCards,
  userTotalGeneratedCards,
  lastBlockGeneratedAt,
  drawRandomNumber,
  purchasePokeCard,
  mintDrawnPokemon,
  stakeCard,
  unstakeCard,
  blockNumber,
  requestDataArray,
  ethUsdPrice
}
}

export default usePokeData
