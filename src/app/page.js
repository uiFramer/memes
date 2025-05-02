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
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.slice(0, 100).map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
          
    </div>
  )
}
