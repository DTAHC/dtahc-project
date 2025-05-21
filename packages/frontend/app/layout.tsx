import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import Providers from './providers'
import HydrationFix from '../components/ui/HydrationFix'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DTAHC - Gestion des autorisations de travaux',
  description: 'Application de gestion des dossiers d\'autorisations de travaux pour DTAHC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <HydrationFix />
        <Script src="/reload.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}