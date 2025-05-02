import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './redux/provider'
import Navbar from './components/Navbar'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Meme Community',
  description: 'World Meme Community',
  keywords: 'memes, funny, humor, meme templates, trending, meme share, internet culture',
  author: 'Meme Community',
  openGraph: {
    title: 'Memes Community',
    description: 'World Meme Community',
    url: 'https://memecommunity.netlify.app',
    type: 'website',
    images: [
      {
        url: 'https://www.memeverse.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Meme Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@memecommunity',
    title: 'Meme Community',
    description: 'World Meme Community',
    image: 'https://www.memeverse.com/twitter-image.jpg',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body className={inter.className}>
      <Providers>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster position="top-center" />
        </div>
      </Providers>
    </body>
  </html>
  );
}
