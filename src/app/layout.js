import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './redux/provider'
import Navbar from './components/Navbar'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Memestr',
  description: 'Türk meme topluluğu.',
  keywords: 'memes, komik, mizah, meme şablonları, trending, meme paylaş, internet kültürü',
  author: 'Memestr',
  openGraph: {
    title: 'Memestr',
    description: 'Türk meme topluluğu.',
    url: 'https://memestr.netlify.app',
    type: 'website',
    images: [
      {
        url: 'https://www.memeverse.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Memestr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@memestr',
    title: 'Memestr',
    description: 'Türk meme topluluğu.',
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
