"use client";
import React from 'react'
import {WagmiProvider} from '@privy-io/wagmi';
import { config } from './wagmiConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';

type Props = {
    children:React.ReactNode
}
export const queryClient = new QueryClient();

function WagmiWrapper({children}: Props) {

  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID as string}
      config={{
        defaultChain: sepolia,
        appearance:{
          theme:'dark',
        },
        supportedChains:[sepolia],
        'loginMethods':['email', 'wallet', 'github', "google"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        }
      }}>
<QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
        {children}
    </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

export default WagmiWrapper