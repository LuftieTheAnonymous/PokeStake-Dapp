'use client';

import { snorlieCoinABI, snorlieCoinContractAddress } from "@/contracts-abis/SnorlieCoin";
import { type PokemonCard, type StakedCard, type Rarity, pokemonModulators, pokemonAmountModulator, rarityModulator } from "./types";
import { injected, useAccount, useBlockNumber, useConnect, useDisconnect, useReadContracts, useWriteContract } from 'wagmi'
import { useMemo } from "react";
import { pokeCardCollectionAbi, pokeCardCollectionAddress } from "@/contracts-abis/PokeCardCollection";
import {PokemonClient} from "pokenode-ts";
import { VRFConsumerAbi, VrfCosumerAddress } from "@/contracts-abis/VRFConsumer";
import { config } from "./wagmi/wagmiConfig";
import { pokemonStakingAbi, pokemonStakingAddress } from "@/contracts-abis/PokemonStaking";
import { pinata } from "@/utils/PinataConfig";


function usePokeData() {
const pokemonClient = new PokemonClient();
 const {mutate}=useConnect({config});
  const {mutate:disconnect}=useDisconnect()


  const {address, isConnected, isConnecting}= useAccount();
  const {writeContract}=useWriteContract();
  const {data:blockNumber}=useBlockNumber();
  const {data}=useReadContracts({contracts:[
    {
        abi:snorlieCoinABI,
         address:snorlieCoinContractAddress, 
        functionName:"balanceOf",
        args:[address],
    },
    {
      abi:pokeCardCollectionAbi,
      address:pokeCardCollectionAddress,
      functionName:"totalSupply",
      args:[]
    },
    {
      abi: pokeCardCollectionAbi,
      address: pokeCardCollectionAddress,
      functionName:"getGeneratedCards",
      args:[address]
    },
     {
      abi: pokeCardCollectionAbi,
      address: pokeCardCollectionAddress,
      functionName:"getTotalCardsGenerated",
      args:[address]
    },
    {
      abi:pokeCardCollectionAbi,
      address:pokeCardCollectionAddress,
      functionName:"getLastTimeGenerated",
      args:[address]
    },
    {
      abi: VRFConsumerAbi,
      address:VrfCosumerAddress,
      functionName:"getRandomWords",
    },
    {
      abi:VRFConsumerAbi,
      address: VrfCosumerAddress,
      functionName:"getRequestId"
    },
    {
      abi: pokemonStakingAbi,
      address: pokemonStakingAddress,
      functionName:"getRewardAmount"
    },
    {
      abi:pokemonStakingAbi,
      address:pokemonStakingAddress,
      functionName:"calculateAPY"
    },
    {
      abi:pokemonStakingAbi,
      address:pokemonStakingAddress,
      functionName:"calculateRewards",
      args:[address]
    },
    {
      abi:pokeCardCollectionAbi,
      address: pokeCardCollectionAddress,
      functionName:"balanceOf",
      args:[address]
    },
    {
       abi:pokemonStakingAbi,
      address:pokemonStakingAddress,
      functionName:"getStakedPositions",
      args:[address]
    }
  ],
  account:address,
query:{
  enabled: typeof address === 'string',
}
});

const snorliesBalance = useMemo(()=>{
    return data && data[0].result ?  Number((data[0].result as bigint) / BigInt(1e18)) : 0;
},[data]);

const ownedPokeCards = useMemo(()=>{
    return data && data[10].result ?  Number((data[10].result as bigint) / BigInt(1e18)) : 0;
},[data]);


const totalSupply= useMemo(()=>{
  return data && data[1].result ? Number(data[1].result) : 0;
},[data]);

const userGeneratedCards = useMemo(()=>{
  return data && data[2].result ? data[2].result as any[] : [];
},[data]);

const userTotalGeneratedCards=useMemo(()=>{
  return data && data[3].result ? Number(data[3].result) : 0;
},[data]);

const userStakedPokeCards = useMemo(()=>{
  return data && data[11].result ? (data[11].result as any[]) : [] 
},[data])

const lastBlockGeneratedAt = useMemo(()=>{
  return data && data[4].result ? Number(data[4].result) : 0
},[data]);

const isElligibleToDraw=useMemo(()=>{

  return Number(blockNumber) - lastBlockGeneratedAt < 86400;

},[lastBlockGeneratedAt, blockNumber])

const getRandomNumbers:{randomValues:bigint[] | undefined, pokemonParams:number[] | undefined }= useMemo(()=>{
  let randomValues:bigint[] | undefined = data && data[5].result ? (data[5].result as bigint[]) : undefined;

  let randomValuesIntoPokemonParams = randomValues ?(randomValues as bigint[]).map((element:bigint, index:number)=> Number(element % pokemonModulators[index])) : undefined;

  return {
    randomValues,
    pokemonParams:randomValuesIntoPokemonParams
  }

},[data]);

const requestId = useMemo(()=>{
  const vrfRequestId:number | undefined = data && data[6].result ? Number((data[6].result as bigint)) : undefined;
  return vrfRequestId;
},[data]);

const stakingRewardToClaim = useMemo(()=>{
  return data && data[7].result ? Number((data[7].result as bigint) /BigInt(1e18)) : 0;
},[data]);

const APYinToken = useMemo(()=>{
  return data && data[8].result ? Number((data[8].result as bigint) /BigInt(1e18)) : 0;
},[data]);

const getCalculatedRewards = useMemo(()=>{
  return data && data[9].result ? Number((data[9].result as bigint) /BigInt(1e18)) : 0;
},[data])


async function drawRandomNumber(){
writeContract({
  abi: VRFConsumerAbi,
  address: VrfCosumerAddress,
  functionName:"requestRandomWords",
  args:[]
});

return getRandomNumbers;

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
const pokemonParams=getRandomNumbers.randomValues;


if(!pokemonParams || pokemonParams.length === 0) throw new Error("No drawn have been drawn");

const pokeIndex = Number(pokemonParams[0] % BigInt(1.5e18) % pokemonAmountModulator);
const pokemonRarity = Number(pokemonParams[1] % BigInt(2e18) % rarityModulator) + 2;
  
  const pokemonData = await pokemonClient.getPokemonById(pokeIndex);
  return {
    name: pokemonData.name,
    pokedexIndex: pokemonData.id,
    pokemonRarity,
    pokemonImage: generatePokemonImageUrl(Number(pokeIndex)),
    sprites: [pokemonData.sprites.front_default, pokemonData.sprites.back_default],
    types: pokemonData.types.map((pokemonType)=>pokemonType.type.name),
    description:`${pokemonData.types.map((pokemonType)=>pokemonType.type.name).length === 2 ? `${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[0]}/${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[1]}` : `${pokemonData.types.map((pokemonType)=>pokemonType.type.name)[0]}`}`,
    hp: pokemonData.stats.find((s) => s.stat.name === "hp")?.base_stat || 50,
    attack: pokemonData.stats.find((s) => s.stat.name === "attack")?.base_stat || 50,
    defense: pokemonData.stats.find((s) => s.stat.name === "defense")?.base_stat || 50,
    
  };
} catch (error) {
  throw new Error("Failed to fetch Pokemon data");
}
}

function generateRandomNumbers(){
  try {
    writeContract({
      abi:VRFConsumerAbi, 
      address:VrfCosumerAddress,
      functionName:"requestRandomWords"
    });


  } catch (error) {
    console.log(error);
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


      if(!data || !data[1].result) throw new Error("Result not found for new Card");

        const newCard: PokemonCard = {
          name: pokemon.name,
          image: pokemon.pokemonImage,
          description: pokemon.description,
          attributes:{
          pokedexIndex: pokemon.pokedexIndex,
          id: Number(data[1].result as bigint) + 1,
          rarity: selectedKey as Rarity,
          sprites:pokemon.sprites,
          type: pokemon.types,
          hp: Math.floor(pokemon.hp * (rarityBoost)),
          attack: Math.floor(pokemon.attack * rarityBoost),
          defense: Math.floor(pokemon.defense * rarityBoost),
          }
        };
      
        return newCard;
      }


 async function mintDrawnPokemon(drawnPokemonCard:PokemonCard){
  try {
      const randomValues = getRandomNumbers.randomValues;

    if(!randomValues || randomValues.length === 0) throw new Error("No random values have been detected.");

    const storeInPinata = await pinata.upload.public.json(drawnPokemonCard);

    console.log(storeInPinata);

    console.log(randomValues);
      
        writeContract({
          abi: pokeCardCollectionAbi,
          address:pokeCardCollectionAddress,
          functionName:"generatePokemon",
          args:[randomValues[0], randomValues[1], `https://${process.env.NEXT_PUBLIC_API_ENDPOINT}/ipfs/${storeInPinata.cid}`]
        });
  } catch (error) {
    console.log(error);
  }
  }


function generatePokemonImageUrl(pokedexIndex: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexIndex}.png`;
}

return {
  drawCard,
  claimRewards,
  getRandomPokemon,
  getRandomNumbers,
  snorliesBalance,
  walletAddress: address,
  isConnected,
  generateRandomNumbers,
  isConnecting,
  isElligibleToDraw,
  totalSupply,
  requestId,
  userGeneratedCards,
  userStakedPokeCards,
  stakingRewardToClaim,
  getCalculatedRewards,
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