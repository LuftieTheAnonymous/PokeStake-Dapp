import React from 'react'

import { Navigation } from "@/components/navigation";
import { GradientBackground } from "@/components/gradient-background";

type Props = {}

function Page({}: Props) {
  return (
<div className="min-h-screen relative">
      <GradientBackground />
      <Navigation />
      
      

</div>
  )
}

export default Page