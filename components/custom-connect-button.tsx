'use client';

import { useExportWallet, useLogin, usePrivy } from '@privy-io/react-auth';
import { Button } from './ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog"
import { DialogHeader, DialogFooter } from './ui/dialog';
import { RiExportFill } from 'react-icons/ri';
import { useAccount } from 'wagmi';
import { FaEthereum, FaUser } from 'react-icons/fa';
import { getBalance } from 'viem/actions';
import { config } from '@/lib/wagmi/wagmiConfig';
import { Client } from 'viem';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
;

export function CustomConnectButton() {
  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
      console.log('User logged in successfully', user);
      console.log('Is new user:', isNewUser);
      console.log('Was already authenticated:', wasAlreadyAuthenticated);
      console.log('Login method:', loginMethod);
      console.log('Login account:', loginAccount);
    },
    onError: (error) => {
      console.error('Login failed', error);
    }
  });
const {exportWallet} = useExportWallet();

  const { user, logout, ready:isReady} = usePrivy();

const { data: balance, isLoading, error } = useQuery({
  queryKey: ['balance', user?.wallet?.address],
  queryFn: async () => {
    if (!user?.wallet?.address) throw new Error('Address required');
    return await getBalance(config.getClient(), {
      address: user.wallet.address as `0x${string}`,
    });
  },
  enabled: !!user?.wallet?.address,
  staleTime: 30000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
});


  const isAuthenticated = !!user;

  // Extract wallet address (handles both embedded and connected wallets)
  const walletAddress = user && user.wallet && user.wallet.address;

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : user?.email || 'User';

  if (!isReady) {
    return (
      <Button size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        size="sm"
        onClick={login}
        className="bg-primary hover:bg-primary/90 cursor-pointer"
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  // User is logged in
  return (
    <div className="flex gap-2 items-center">
<Dialog>
  <DialogTrigger asChild>
    <Button
      variant="outline"
      size="sm"
      className="border-primary/50 bg-primary/5 cursor-default"
    >
      <Wallet className="h-4 w-4 mr-2" />
      <span className="font-mono text-xs">{displayAddress && displayAddress.toString()}</span>
    </Button>
  </DialogTrigger>
  <DialogContent className="wallet-dialog-glow sm:max-w-sm h-96 flex flex-col justify-between">
    <DialogHeader>
      <DialogTitle>Logged In As</DialogTitle>
      <DialogDescription>
        {walletAddress && `${walletAddress.slice(0, 15)}...${walletAddress.slice(-6)}`}
      </DialogDescription>
    </DialogHeader>

    <div className="w-full flex flex-col gap-5">
        <Button
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer"
        onClick={exportWallet}
      >
        View Profile <FaUser/>
      </Button>
      
      <Button
        className="flex items-center gap-2 bg-[var(--pokemon-orange)] hover:bg-[var(--pokemon-orange)]/85 cursor-pointer"
        onClick={exportWallet}
      >
        Export Your Wallet <RiExportFill />
      </Button>
    </div>


        {balance
         &&
         <div className='flex items-center gap-2 justify-between'>
          <p className='font-bold text-lg'>Balance</p>
           <div className='flex items-center gap-3'>
          <p>
        {
        Number(Number(balance)/1e18).toFixed(5)
        }
          </p>
          <FaEthereum />
          </div>
         </div>
         }
  

    <DialogFooter>
      <Button
        className="w-full p-2 cursor-pointer"
        onClick={logout}
      >
        Log out <LogOut />
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}