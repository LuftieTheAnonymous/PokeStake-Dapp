"use client";
import React from 'react'
import {WagmiProvider} from '@privy-io/wagmi';
import { config } from './wagmiConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth';
import { sepolia } from 'viem/chains';
import { useSupabase } from '../supabase/SupabaseProvider';

type Props = {
    children:React.ReactNode
}

function WagmiWrapper({children}: Props) {

    const {loading, supabase, session} = useSupabase();

  async function getCustomAuthToken() {
    if (!session) return undefined;

    const {data, error} = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return undefined;
    }

    return data.session?.access_token || undefined;
  }


    const queryClient = new QueryClient()

  return (
    <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID as string}
      config={{
        defaultChain: sepolia,
        appearance:{
          theme:'dark',
        },
         customAuth: {
          isLoading: loading,
          getCustomAccessToken: getCustomAuthToken
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