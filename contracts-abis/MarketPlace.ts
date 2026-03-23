export const marketPlaceAddress="0xf9BD9c14a2Fb781d2eD4475A6A459c228677AE04";

export const marketPlaceAbi=[
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "snorlieCoinAddress",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "pokeCardCollectionAddress",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "ethUsdPriceFeed",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "initialManager",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    { "type": "fallback", "stateMutability": "nonpayable" },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "delistPokemonCard",
      "inputs": [
        { "name": "listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getLatestEthUsdPrice",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListing",
      "inputs": [
        { "name": "listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct MarketPlace.SaleListing",
          "components": [
            {
              "name": "listingOwner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "nftId", "type": "uint256", "internalType": "uint256" },
            { "name": "tokenURI", "type": "string", "internalType": "string" },
            {
              "name": "listingBlockNumber",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "expiryBlock",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "listingPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "isPriceInEth", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListings",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct MarketPlace.SaleListing[]",
          "components": [
            {
              "name": "listingOwner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "nftId", "type": "uint256", "internalType": "uint256" },
            { "name": "tokenURI", "type": "string", "internalType": "string" },
            {
              "name": "listingBlockNumber",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "expiryBlock",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "listingPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "isPriceInEth", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListingsAmount",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "grantManagerRole",
      "inputs": [
        { "name": "newManager", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "grantRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "hasRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "listPokeCard",
      "inputs": [
        { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "listingPrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "isEthPrice", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
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
      "name": "preLongListingTimeInEth",
      "inputs": [
        { "name": "listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "preLongListingTimeInSnorlie",
      "inputs": [
        { "name": "listingId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "amountOfSnorlies",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "purchasePokeCard",
      "inputs": [
        { "name": "listingId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "snorliesAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "renounceRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        {
          "name": "callerConfirmation",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "revokeManagerRole",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "revokeRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
        { "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "updateEthUsdPrice",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "withdrawContractAmount",
      "inputs": [
        {
          "name": "amountToPayout",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "event",
      "name": "ListedPokeCard",
      "inputs": [
        {
          "name": "seller",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ListingApperancePrelonged",
      "inputs": [
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "prelonger",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PokeCardDelisted",
      "inputs": [
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "tokenId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PokeCardSold",
      "inputs": [
        {
          "name": "puchasedBy",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "blockNumber",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "previousAdminRole",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "newAdminRole",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleGranted",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "account",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleRevoked",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "account",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "WithdrawnAmount",
      "inputs": [
        {
          "name": "amountPaidout",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "managerAddress",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    { "type": "error", "name": "AccessControlBadConfirmation", "inputs": [] },
    {
      "type": "error",
      "name": "AccessControlUnauthorizedAccount",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" },
        { "name": "neededRole", "type": "bytes32", "internalType": "bytes32" }
      ]
    },
    {
      "type": "error",
      "name": "CannotBeListingOwner",
      "inputs": [
        { "name": "listingId", "type": "uint256", "internalType": "uint256" },
        { "name": "owner", "type": "address", "internalType": "address" },
        { "name": "caller", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "IncorrectAmountProvided",
      "inputs": [
        {
          "name": "providedAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "expectedAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    { "type": "error", "name": "IncorrectListingIdProvided", "inputs": [] },
    { "type": "error", "name": "InvalidPayment", "inputs": [] },
    {
      "type": "error",
      "name": "ListingExpired",
      "inputs": [
        { "name": "expiryBlock", "type": "uint256", "internalType": "uint256" },
        { "name": "listingId", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "NonExistingSnorliePrelongingOffer",
      "inputs": []
    },
    { "type": "error", "name": "NotEnoughContractBalance", "inputs": [] },
    {
      "type": "error",
      "name": "NotEnoughEtherToPayFee",
      "inputs": [
        {
          "name": "transferredAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    },
    { "type": "error", "name": "NotEnoughSnorlies", "inputs": [] },
    {
      "type": "error",
      "name": "NotManager",
      "inputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "NotOwnerOfListing",
      "inputs": [
        { "name": "sender", "type": "address", "internalType": "address" },
        { "name": "owner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "NotPokeCardOwner",
      "inputs": [
        { "name": "caller", "type": "address", "internalType": "address" },
        { "name": "actualOwner", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "PriceCannotBeZero", "inputs": [] },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }
  ];