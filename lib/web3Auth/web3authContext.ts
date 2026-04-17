import { type Web3AuthContextConfig } from '@web3auth/modal/react'
import { WALLET_CONNECTORS, WEB3AUTH_NETWORK, type Web3AuthOptions } from '@web3auth/modal'
import { snorlieCoinContractAddress } from '@/contracts-abis/SnorlieCoin'

const web3AuthOptions: Web3AuthOptions = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string, // Pass your Web3Auth Client ID, ideally using an environment variable // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  

}

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
}

export default web3AuthContextConfig