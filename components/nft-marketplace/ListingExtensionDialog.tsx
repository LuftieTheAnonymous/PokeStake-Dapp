'use client';

import { useState } from 'react';
import {ClockPlus} from "lucide-react";
import { FaEthereum } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import SnorlieImage from '@/public/snorlie.png'
import { Currency, ethOptions, snorliesOptions } from '../../lib/types';
import usePokeData from '@/hooks/usePokeData';



interface PaymentDialogProps {
    listingId:bigint,
  triggerText?: string;
}

export function PaymentDialog({listingId,
  triggerText = 'Pay Now',
}: PaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('ETH');
  const [extensionOption, setExtensionOption] = useState<"1 day" | "1 week" | "1 month" | "1 year">();

  const {ethUsdPrice, payListingTimeExtensionInEth, payListingTimeExtensionInSnorlies}=usePokeData();

  const handleSubmit = () => {
    const foundEthElement = ethOptions.find((element)=>element.timeExtension === extensionOption);
    const snorliesElementFound = snorliesOptions.find((element)=>element.timeExtension === extensionOption);
    
    if(selectedCurrency ==='ETH' && foundEthElement){
        payListingTimeExtensionInEth(listingId, (foundEthElement.amountOfTokens * BigInt(1e18)) / BigInt(ethUsdPrice * 1e18))
    }

    if(snorliesElementFound && selectedCurrency){
        payListingTimeExtensionInSnorlies(listingId, snorliesElementFound.amountOfTokens);
    }
 
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-400 font-default w-full sm:w-1/2 hover:bg-blue-500 text-primary-foreground py-6">
        <ClockPlus/>
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md bg-gradient-to-br from-background to-card border-border/50 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pokemon-red to-pokemon-blue bg-clip-text text-transparent">
            Select Extension Option
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose your preferred currency or token and extension option
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Currency Select */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Currency
            </label>
            <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as Currency)}>
              <SelectTrigger className="bg-input border-border/50 text-foreground hover:border-primary/50 focus:border-primary focus:ring-primary/30">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="ETH" className="cursor-pointer flex items-center gap-3 hover:bg-primary/10">
                <FaEthereum className="w-5 h-5 text-pokemon-blue" />
                Ether
                </SelectItem>
                <SelectItem value="SNORLIE" className="cursor-pointer flex items-center gap-3 hover:bg-primary/10">
                  <Image src={SnorlieImage} alt='' width={24} height={24} className='w-6 h-6'/>
                  SNORLIE
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Listing-Time Extension Option
            </label>
            <Select value={extensionOption} onValueChange={(value) => setExtensionOption(value as "1 day" | "1 week" | "1 month" | "1 year")}>
              <SelectTrigger className="bg-input border-border/50 text-foreground hover:border-primary/50 focus:border-primary focus:ring-primary/30">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
              {selectedCurrency === 'ETH' ? ethOptions.map((ethOption)=>(
                <SelectItem value={ethOption.timeExtension} className="cursor-pointer hover:bg-primary/10">
                  <div className="flex items-center gap-2">
             <span className='capitalize'>{ethOption.timeExtension}</span> - <span className=''>({(Number(ethOption.amountOfTokens / BigInt(1e18)) / ethUsdPrice).toFixed(4)}) ETH</span>
                  </div>
                </SelectItem>)) : snorliesOptions.map((snorlieOption)=>(<div>
                     <span className='capitalize'>{snorlieOption.timeExtension}</span> - <span className=''>({(Number(snorlieOption.amountOfTokens / BigInt(1e18))).toFixed(4)}) SNORLIE</span>
                </div>))}
                
                
              </SelectContent>
            </Select>
          </div>

          {/* Selected Payment Summary */}
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-pokemon-red/10 to-pokemon-blue/10 border border-pokemon-red/20 dark:border-pokemon-red/30">
            <p className="text-sm text-muted-foreground mb-2">Selected Payment:</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedCurrency === 'ETH' ? (
                  <>
                    <FaEthereum className="w-5 h-5 text-pokemon-blue" />
                    <span className="font-semibold text-foreground">ETH</span>
                  </>
                ) : (
                  <>
                    <Image src={SnorlieImage} alt='' width={24} height={24} className='w-6 h-6'/>
                    <span className="font-semibold text-foreground">SNORLIE</span>
                  </>
                )}
              </div>
              <span className="font-bold text-pokemon-red">
              {selectedCurrency === 'ETH' && ethOptions.find((element)=>element.timeExtension === extensionOption) && `${(Number(ethOptions[ethOptions.findIndex((element)=>element.timeExtension === extensionOption)].amountOfTokens / BigInt(1e18)) / ethUsdPrice).toFixed(4)}`}
              {selectedCurrency === 'SNORLIE' && snorliesOptions.find((element)=>element.timeExtension === extensionOption) && `${(Number(snorliesOptions[snorliesOptions.findIndex((element)=>element.timeExtension === extensionOption)].amountOfTokens / BigInt(1e18)) / ethUsdPrice).toFixed(4)}`}

                {selectedCurrency.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 border-border/50 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-pokemon-red to-pokemon-orange hover:from-pokemon-red/90 hover:to-pokemon-orange/90 text-primary-foreground font-semibold shadow-lg"
          >
            Proceed to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
