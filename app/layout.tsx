import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Liquify',
  description: 'Transform your images into stunning liquid art using AI-powered image generation',
  generator: 'v0.app',
  icons: {
    icon: '/liq.webp',
    shortcut: '/liq.webp',
    apple: '/liq.webp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} style={{ fontFamily: '"Roboto Slab", serif' }}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
