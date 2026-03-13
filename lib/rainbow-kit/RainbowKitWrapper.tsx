'use client';

import React from 'react'

import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';


function RainbowKitWrapper({children}: {children:React.ReactNode}) {
  return (

        <RainbowKitProvider>
        {children}
        </RainbowKitProvider>
     
  )
}

export default RainbowKitWrapper