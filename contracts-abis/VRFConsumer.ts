export const VrfCosumerAddress="0xC5d966c6e48385bccc3c2cA500Df9593Aa5d5a8C";

export const VRFConsumerAbi =[
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "subscriptionId",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "vrfCoordinator",
          "type": "address",
          "internalType": "address"
        },
        { "name": "keyHash", "type": "bytes32", "internalType": "bytes32" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "acceptOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getRandomWords",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRequestId",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getSubscriptionId",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "rawFulfillRandomWords",
      "inputs": [
        { "name": "requestId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "randomWords",
          "type": "uint256[]",
          "internalType": "uint256[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "requestRandomWords",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "s_randomWords",
      "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_requestId",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "s_vrfCoordinator",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract IVRFCoordinatorV2Plus"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "setCoordinator",
      "inputs": [
        {
          "name": "_vrfCoordinator",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "to", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "CoordinatorSet",
      "inputs": [
        {
          "name": "vrfCoordinator",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferRequested",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ReturnedRandomness",
      "inputs": [
        {
          "name": "randomWords",
          "type": "uint256[]",
          "indexed": false,
          "internalType": "uint256[]"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "OnlyCoordinatorCanFulfill",
      "inputs": [
        { "name": "have", "type": "address", "internalType": "address" },
        { "name": "want", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "OnlyOwnerOrCoordinator",
      "inputs": [
        { "name": "have", "type": "address", "internalType": "address" },
        { "name": "owner", "type": "address", "internalType": "address" },
        { "name": "coordinator", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
    { "type": "error", "name": "ZeroAddress", "inputs": [] }
  ]