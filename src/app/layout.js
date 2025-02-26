import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './redux/provider'
import Navbar from './components/Navbar'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MemeVerse - Your Ultimate Meme Platform',
  description: 'Explore, create, and share the best memes on the internet. Stay updated with trending memes and showcase your creativity.',
  keywords: 'memes, funny, humor, meme generator, trending memes, share memes, internet culture',
  author: 'MemeVerse Team',
  openGraph: {
    title: 'MemeVerse - Your Ultimate Meme Platform',
    description: 'Explore, create, and share the best memes on the internet. Stay updated with trending memes and showcase your creativity.',
    url: 'https://www.memeverse.com',
    type: 'website',
    images: [
      {
        url: 'https://www.memeverse.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MemeVerse Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MemeVerse',
    title: 'MemeVerse - Your Ultimate Meme Platform',
    description: 'Join MemeVerse to explore and share the best memes trending on the internet!',
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