'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { fetchMemes } from './redux/slices/memesSlice'
import MemeCard from './components/MemeCard'

export default function Home() {
  const dispatch = useDispatch()
  const { memes, loading, error } = useSelector((state) => state.memes)

  useEffect(() => {
    dispatch(fetchMemes())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          Türk Meme Topluluğu 🇹🇷
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          İnternetteki en iyi mimler için tek adresiniz. Harika topluluğumuzla mimlere bir göz atın, oluşturun ve paylaşın!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.slice(0, 100).map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  )
}
