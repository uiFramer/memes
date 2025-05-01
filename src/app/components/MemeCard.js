'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Heart,  Share2, MessageCircle } from 'lucide-react'
import { toggleLikeMeme } from '../redux/slices/memesSlice'
import Link from 'next/link'

export default function MemeCard({ meme }) {
  const dispatch = useDispatch()
  const likedMemes = useSelector((state) => state.memes.likedMemes)
  const isLiked = likedMemes.includes(meme.id)
  const [isHovered, setIsHovered] = useState(false)  
  

  const handleLike = () => {
    dispatch(toggleLikeMeme(meme.id))
  }

  return (
    <motion.div
      className="meme-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/meme/${meme.id}`}>
        <div className="relative">
          <img
            src={meme.url}
            alt={meme.name}
            className="transition-transform duration-300"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 dark:text-white h-14">{meme.name}</h3>
        
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`like-button ${isLiked ? 'liked' : 'Beğendim'}`}
          >
            <Heart className={isLiked ? 'fill-current' : 'Beğendim'} size={20} />
            <span>Beğen</span>
          </motion.button>

          <div className="flex space-x-4">
            <button className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              <MessageCircle size={20} />
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
