import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Fira_Code } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import WagmiWrapper from '@/lib/wagmi/WagmiWrapper'
import RainbowKitWrapper from '@/lib/rainbow-kit/RainbowKitWrapper'
import { Navigation } from '@/components/navigation'
import { GradientBackground } from '@/components/gradient-background'
import { Toaster } from 'sonner'
import Web3AuthProvider from '@/lib/web3Auth/Web3AuthProvider'


const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-sans"
});

const firaCode = Fira_Code({ 
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: 'PokeStake | Pokemon Card Web3 Staking Protocol',
  description: 'Stake your Pokemon cards and earn $PKMN tokens. Draw rare cards, manage your staking portfolio, and collect NFTs.',
  generator: 'Snorlie',
  icons: {
    icon: [
      {
        url: '/snorlie.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/snorlie.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/snorlie.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/snorlie.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${firaCode.variable} overflow-x-hidden font-sans antialiased`}>

        <WagmiWrapper>
          <RainbowKitWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
              <GradientBackground />
                  <Navigation />
            {children}
            <Toaster toastOptions={{
    style: {
        backgroundImage: "linear-gradient(45deg, oklch(0.72 0.18 55) 20%, oklch(0.14 0.01 250) 100%)", // Gradient from orange to dark background
        borderColor: "oklch(0.72 0.18 55)", 
        borderWidth: 2,
        color: "white",
        fontSize:13,
        font:'inherit',
        boxShadow: "0 0 5px oklch(0.72 0.18 55), 0 0 10px oklch(0.72 0.18 55)" // Adjusted shadow for glow effect
    }
}} />
        </ThemeProvider>
        </RainbowKitWrapper>
        </WagmiWrapper>
      </body>
    </html>
  )
}
