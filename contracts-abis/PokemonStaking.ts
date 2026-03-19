export const pokemonStakingAddress = "0x388c48824Cb53623071F1443fA5313994f8D3de8";

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
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "calculateAPY",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "calculateRewards",
      "inputs": [
        { "name": "user", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
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
      "inputs": [
        { "name": "member", "type": "address", "internalType": "address" }
      ],
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
            {
              "name": "pokedexId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "rarityLevel",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "nftId", "type": "uint256", "internalType": "uint256" },
            { "name": "tokenURI", "type": "string", "internalType": "string" },
            { "name": "pinataId", "type": "string", "internalType": "string" },
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
      "name": "onERC721Received",
      "inputs": [
        { "name": "operator", "type": "address", "internalType": "address" },
        { "name": "from", "type": "address", "internalType": "address" },
        { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
        { "name": "data", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
      "stateMutability": "nonpayable"
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
    { "type": "error", "name": "NeedToClaimRewardsFirst", "inputs": [] },
    { "type": "error", "name": "NotTheOwnerOfTheNFT", "inputs": [] },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
    { "type": "error", "name": "ZeroAmountOfAwards", "inputs": [] }
  ]