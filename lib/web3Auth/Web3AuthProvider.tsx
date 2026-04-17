'use client';

import React from "react"
import web3AuthContextConfig from "./web3authContext"

type Props = {children:React.ReactNode}

function Web3AuthProvider({children}: Props) {
  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      {children}
    </Web3AuthProvider>
  )
}

export default Web3AuthProvider