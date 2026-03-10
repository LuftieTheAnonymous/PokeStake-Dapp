export const pokemonStakingAddress = "0xFB757821c77a3f286285ecD05D582E27493D0f73";

export const pokemonStakingAbi= [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "rewardToken_",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "nftCollection_",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "pokeCardGenerator_",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_rewardCalculator",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "claimRewards",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getRewardAmount",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getStakedPositions",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PokemonStakingPool.PokeStakePosition[]",
          "components": [
            { "name": "nftId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pokemonRarityLevel",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "stakedAtBlock",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "stake",
      "inputs": [
        { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "unstake",
      "inputs": [
        { "name": "tokenId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "RewardsClaimed",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Staked",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "pokemonRarityLevel",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "stakedAtBlock",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Unstaked",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "MinimumBlocksToUnstakeNotReached",
      "inputs": []
    },
    { "type": "error", "name": "NotTheOwnerOfTheNFT", "inputs": [] },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }
  ]