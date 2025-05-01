'use client'

import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Trophy, ThumbsUp, MessageCircle, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function Leaderboard() {
  const { memes, likedMemes } = useSelector((state) => state.memes)

  // Calculate engagement score (likes + comments + shares)
  const topMemes = memes
    .map(meme => ({
      ...meme,
      likes: likedMemes.includes(meme.id) ? 1 : 0,
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
    }))
    .sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
    .slice(0, 10)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold dark:text-white flex items-center justify-center gap-2">
          <Trophy className="text-yellow-500" size={32} />
          Lider Tablosu
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Tüm zamanların en ilgi çekici 10 mimi.
        </p>
      </motion.div>

      <div className="space-y-4">
        {topMemes.map((meme, index) => (
          <motion.div
            key={meme.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <Link href={`/meme/${meme.id}`}>
              <div className="flex items-center p-4 gap-4 sm:gap-2">
                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                  <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                </div>

                <div className="flex-shrink-0">
                  <img
                    src={meme.url}
                    alt={meme.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold truncate dark:text-white">
                    {meme.name}
                  </h2>

                  <div className="flex items-center gap-3 sm:gap-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      <span></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      <span></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 size={16} />
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
