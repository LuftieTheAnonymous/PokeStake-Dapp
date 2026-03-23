import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';


export function CustomConnectButton() {
  return (
    <ConnectButton.Custom>{({account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
})=>{
    const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
   return (
          <div>
            {!ready && (
              <Button size="sm" disabled>
                Loading...
              </Button>
            )}

            {ready && !connected && (
              <Button
                size="sm"
                onClick={openConnectModal}
                className="bg-primary hover:bg-primary/90 cursor-pointer"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            {connected && (
              <div className="flex gap-2">
                {chain.unsupported && (
                  <Button
                    size="sm"
                    onClick={openChainModal}
                    className="bg-red-500/20 border border-red-500 hover:bg-red-500/30"
                  >
                    Wrong Network
                  </Button>
                )}

          
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAccountModal}
                  className="border-primary/50 hover:border-primary hover:bg-primary/10 cursor-pointer"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  <span className="font-mono text-xs">
                    {account.displayName}
                  </span>
                </Button>
              </div>
            )}
          </div>
        );
    
    }}    
    </ConnectButton.Custom>
  )
}

