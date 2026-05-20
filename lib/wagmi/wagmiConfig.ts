import { createConfig } from '@privy-io/wagmi'
import { http } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://eth-sepolia-testnet.api.pocket.network"),
  },
})