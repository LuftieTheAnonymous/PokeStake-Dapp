import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Fira_Code } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import WagmiWrapper from '@/lib/wagmi/WagmiWrapper'

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
      <body className={`${spaceGrotesk.variable} ${firaCode.variable} font-sans antialiased`}>
        <WagmiWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        </WagmiWrapper>
        <Analytics />
      </body>
    </html>
  )
}
