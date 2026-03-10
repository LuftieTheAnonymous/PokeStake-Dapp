"use client";
import React from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from './wagmiConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type Props = {
    children:React.ReactNode
}

function WagmiWrapper({children}: Props) {
    const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
    </WagmiProvider>
  )
}

export default WagmiWrapper