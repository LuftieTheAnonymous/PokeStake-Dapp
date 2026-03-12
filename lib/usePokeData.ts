'use client';

import { snorlieCoinABI, snorlieCoinContractAddress } from "@/contracts-abis/SnorlieCoin";
import { type PokemonCard, type StakedCard, type Rarity, pokemonModulators } from "./types";
import { injected, useAccount, useBlockNumber, useConnect, useDisconnect, useReadContracts, useWriteContract } from 'wagmi'
import { useMemo, useState } from "react";
import { pokeCardCollectionAbi, pokeCardCollectionAddress } from "@/contracts-abis/PokeCardCollection";
import {PokemonClient} from "pokenode-ts";
import { VRFConsumerAbi, VrfCosumerAddress } from "@/contracts-abis/VRFConsumer";
import { config } from "./wagmi/wagmiConfig";
import { pokemonStakingAbi, pokemonStakingAddress } from "@/contracts-abis/PokemonStaking";
import { pinata } from "@/utils/PinataConfig";
import { readContract } from '@wagmi/core'

function usePokeData() {
const pokemonClient = new PokemonClient();
 const {mutate}=useConnect({config});
  const {mutate:disconnect}=useDisconnect()
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
    // [10] - VRFConsumer getRequestId
    { abi: VRFConsumerAbi, address: VrfCosumerAddress, functionName: "getRequestId" }
  ],
  account: address,
  query: { enabled: typeof address === 'string' }
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


const isElligibleToDraw=useMemo(()=>{

  return Number(blockNumber) - lastBlockGeneratedAt < 86400;

},[lastBlockGeneratedAt, blockNumber]);


async function drawRandomNumber(){
 const result = writeContract({
  abi: VRFConsumerAbi,
  address: VrfCosumerAddress,
  functionName:"requestRandomWords",
  args:[],
});

return result as unknown as bigint;
}

function connectWallet(){
  mutate({'connector': injected({'target':'metaMask'})})
}

function disconnectWallet(){
  disconnect()
}

function stakeCard(tokenId:bigint){
  writeContract({
    abi:pokemonStakingAbi,
    address:pokemonStakingAddress,
    functionName:"stake",
    args:[tokenId]
  })
}

function unstakeCard(tokenId:bigint){
    writeContract({
    abi:pokemonStakingAbi,
    address:pokemonStakingAddress,
    functionName:"unstake",
    args:[tokenId]
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

  if(requestId === BigInt(0)) throw new Error("No request has been requested from you");

  const getRandomValues:bigint[] = await readContract(config, {
    abi:pokeCardCollectionAbi,
    address:pokeCardCollectionAddress,
    functionName:"getRandomValuesConverted",
    args:[requestId]   
    }) as unknown as bigint[];

  const pokemonData = await pokemonClient.getPokemonById(Number(getRandomValues[0]));
  return {
    name: pokemonData.name,
    pokedexIndex: pokemonData.id,
    pokemonRarity:Number(getRandomValues[1]),
    pokemonImage: pokemonData.sprites.front_default,
    sprites: [pokemonData.sprites.front_default, pokemonData.sprites.back_default],
    types: pokemonData.types.map((pokemonType)=>pokemonType.type.name),
    pokemonCry: pokemonData.cries.latest,
    description:`${pokemonData.types.map((pokemonType)=>pokemonType.type.name).length === 2 ? `${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[0]}/${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[1]}` : `${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[0]}`}`,
    hp: pokemonData.stats.find((s) => s.stat.name === "hp")?.base_stat || 50,
    attack: pokemonData.stats.find((s) => s.stat.name === "attack")?.base_stat || 50,
    defense: pokemonData.stats.find((s) => s.stat.name === "defense")?.base_stat || 50,
    
  };
} catch (error) {
  throw new Error("Failed to fetch Pokemon data");
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

      const selectedKey=Object.keys(rarityMultiplier).at(pokemon.pokemonRarity);

      const rarityBoost =rarityMultiplier[selectedKey as Rarity];

      if(!pokemon) throw new Error("no pokemon created");

      if(!data || !data[1].result) throw new Error("Result not found for new Card");

        const newCard: PokemonCard = {
          name: pokemon.name,
          image: pokemon.pokemonImage as string,
          description: pokemon.description,
          attributes:{
          pokedexIndex: pokemon.pokedexIndex,
          id: Number(data[1].result as bigint) + 1,
          rarity: selectedKey as Rarity,
          sprites:pokemon.sprites,
          type: pokemon.types,
          hp: Math.floor(pokemon.hp + (rarityBoost)),
          attack: Math.floor(pokemon.attack + rarityBoost),
          defense: Math.floor(pokemon.defense + rarityBoost),
          }
        };
      
        return newCard;
      }


 async function mintDrawnPokemon(reqeustId:bigint, drawnPokemonCard:PokemonCard){
  try {

    const storeInPinata = await pinata.upload.public.json(drawnPokemonCard,{
      'metadata':{
      'keyvalues':{stringifiedAttributes:JSON.stringify(drawnPokemonCard.attributes)}}
  });

    console.log(storeInPinata);
      
        writeContract({
          abi: pokeCardCollectionAbi,
          address:pokeCardCollectionAddress,
          functionName:"generatePokemon",
          args:[reqeustId, `https://${process.env.NEXT_PUBLIC_API_ENDPOINT}/ipfs/${storeInPinata.cid}`]
        });
  } catch (error) {
    console.log(error);
  }
  }



return {
  drawCard,
  requestId,
  claimRewards,
  getRandomPokemon,
  snorliesBalance,
  walletAddress: address,
  isConnected,
  isConnecting,
  isElligibleToDraw,
  totalSupply,
  userGeneratedCards,
  userStakedPokeCards,
  stakingRewardToClaim,
  calculateRewards,
  APYinToken,
  ownedPokeCards,
  userTotalGeneratedCards,
  lastBlockGeneratedAt,
  drawRandomNumber,
  mintDrawnPokemon,
  connectWallet,
  disconnectWallet,
  stakeCard,
  unstakeCard
}
}

export default usePokeData
