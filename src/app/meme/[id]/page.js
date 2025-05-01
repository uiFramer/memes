'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {  Heart,  Share2,  MessageCircle,  Send,  Download } from 'lucide-react'
import { toggleLikeMeme } from '../../redux/slices/memesSlice'
import { toast } from 'sonner'

export default function MemePage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { memes, userMemes, likedMemes } = useSelector((state) => state.memes)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [meme, setMeme] = useState(null)

  // Load comments from localStorage on mount
  useEffect(() => {
    const savedComments = localStorage.getItem(`meme-${id}-comments`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }
  }, [id])

  // Find meme from both API memes and user uploaded memes
  useEffect(() => {
    const findMeme = () => {
      // First check user uploaded memes
      let foundMeme = userMemes.find((m) => m.id === id)
      
      // If not found in user memes, check API memes
      if (!foundMeme) {
        foundMeme = memes.find((m) => m.id === id)
      }

      // If still not found, use placeholder
      if (!foundMeme) {
        foundMeme = {
          id,
          name: 'Meme bulunamadı',
          url: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=1000&auto=format&fit=crop',
          width: 500,
          height: 500,
        }
      }

      setMeme(foundMeme)
    }

    findMeme()
  }, [id, memes, userMemes])

  const isLiked = likedMemes.includes(id)

  const handleLike = () => {
    dispatch(toggleLikeMeme(id))
    toast.success(isLiked ? 'Beğenilmedi!' : 'Beğenildi!')
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: meme?.name,
        text: 'Bu harika memeye göz atın!',
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link kopyalandı!')
    }
  }

  const handleDownload = async () => {
    if (!meme?.url) {
      toast.error('Resim mevcut değil!')
      return
    }

    try {
      const response = await fetch(meme.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${meme.name || 'meme'}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Meme başarıyla yüklendi!')
    } catch (error) {
      toast.error('Meme yüklenemedi')
    }
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    const newComment = {
      id: Date.now(),
      text: comment,
      author: (author),
      timestamp: new Date().toISOString(),
    }

    const updatedComments = [newComment, ...comments]
    setComments(updatedComments)
    localStorage.setItem(`meme-${id}-comments`, JSON.stringify(updatedComments))
    setComment('')
    toast.success('Yorum eklendi!')
  }

  if (!meme) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold dark:text-white">{meme.name}</h1>
        </div>

        <div className="relative">
          <img
            src={meme.url}
            alt={meme.name}
            className="w-full h-auto object-contain max-h-[600px]"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=1000&auto=format&fit=crop'
              toast.error('Resim yüklenemedi')
            }}
          />
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Heart
                  size={20}
                  className={isLiked ? 'fill-current' : ''}
                />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Share2 size={20} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Download size={20} />
              </motion.button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold dark:text-white">Yorumlar</h2>
            
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Yorum yap..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>

            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium dark:text-white">{comment.author}</p>
                      <p className="text-gray-600 dark:text-gray-300">{comment.text}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
