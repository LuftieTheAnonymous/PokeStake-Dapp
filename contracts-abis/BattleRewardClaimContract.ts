export const claimContractAddress = "0x91f349Bec7eD67890F7900843cfd187f650FA3aa";

export const claimRewardAbi = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_backendSigner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_snorlieCoin",
          "type": "address",
          "internalType": "contract SnorlieCoin"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "backendSigner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "claimBattleReward",
      "inputs": [
        { "name": "battleId", "type": "uint256", "internalType": "uint256" },
        { "name": "winner", "type": "address", "internalType": "address" },
        {
          "name": "rewardAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "signature", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "claimedBattles",
      "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "paused",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "setBackendSigner",
      "inputs": [
        { "name": "newSigner", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setPaused",
      "inputs": [{ "name": "_paused", "type": "bool", "internalType": "bool" }],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "snorlieCoin",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract SnorlieCoin"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "RewardClaimed",
      "inputs": [
        {
          "name": "battleId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "winner",
          "type": "address",
          "indexed": false,
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
    { "type": "error", "name": "BattleAlreadyClaimed", "inputs": [] },
    { "type": "error", "name": "ECDSAInvalidSignature", "inputs": [] },
    {
      "type": "error",
      "name": "ECDSAInvalidSignatureLength",
      "inputs": [
        { "name": "length", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "ECDSAInvalidSignatureS",
      "inputs": [{ "name": "s", "type": "bytes32", "internalType": "bytes32" }]
    },
    { "type": "error", "name": "InvalidSignature", "inputs": [] },
    { "type": "error", "name": "NotBattleWinner", "inputs": [] },
    { "type": "error", "name": "RewardClaimPaused", "inputs": [] }
  ];
