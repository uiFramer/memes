'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {  Search,  Filter,  Flame,  Clock,  Star,  TrendingUp } from 'lucide-react'
import { fetchMemes } from '../redux/slices/memesSlice'
import MemeCard from '../components/MemeCard'

export default function Explorer() {
  const dispatch = useDispatch()
  const { memes, userMemes, loading } = useSelector((state) => state.memes)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('trending')
  const [timeFilter, setTimeFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchMemes())
  }, [dispatch])

  // Combine API memes and user memes
  const allMemes = [...memes, ...userMemes].map(meme => ({
    ...meme,
    timestamp: meme.timestamp || Date.now(), // Fallback for API memes
    likes: Math.floor(Math.random() * 1000), // Simulated likes for demo
    views: Math.floor(Math.random() * 5000), // Simulated views for demo
  }))

  const categories = [
    { value: 'all', label: 'All Memes', icon: Star },
    { value: 'trending', label: 'Trending', icon: Flame },
    { value: 'new', label: 'New', icon: Clock },
    { value: 'popular', label: 'Popular', icon: TrendingUp },
  ]

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ]

  const sortOptions = [
    { value: 'trending', label: 'Trending First' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'mostLiked', label: 'Most Liked' },
    { value: 'mostViewed', label: 'Most Viewed' },
  ]

  const filterMemesByTime = (memes) => {
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = 7 * oneDay
    const oneMonth = 30 * oneDay

    switch (timeFilter) {
      case 'today':
        return memes.filter(meme => (now - meme.timestamp) <= oneDay)
      case 'week':
        return memes.filter(meme => (now - meme.timestamp) <= oneWeek)
      case 'month':
        return memes.filter(meme => (now - meme.timestamp) <= oneMonth)
      default:
        return memes
    }
  }

  const sortMemes = (memes) => {
    switch (sortBy) {
      case 'trending':
        return [...memes].sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
      case 'newest':
        return [...memes].sort((a, b) => b.timestamp - a.timestamp)
      case 'oldest':
        return [...memes].sort((a, b) => a.timestamp - b.timestamp)
      case 'mostLiked':
        return [...memes].sort((a, b) => b.likes - a.likes)
      case 'mostViewed':
        return [...memes].sort((a, b) => b.views - a.views)
      default:
        return memes
    }
  }

  const filteredMemes = sortMemes(
    filterMemesByTime(
      allMemes.filter((meme) => {
        const matchesCategory = category === 'all' || 
          (category === 'trending' && (meme.likes + meme.views) > 1000) ||
          (category === 'new' && (Date.now() - meme.timestamp) < 24 * 60 * 60 * 1000) ||
          (category === 'popular' && meme.likes > 500)
        
        const matchesSearch = meme.name.toLowerCase().includes(searchTerm.toLowerCase())
        
        return matchesCategory && matchesSearch
      })
    )
  )

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold text-center dark:text-white">
          Explore Memes
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search memes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
            >
              {timeFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                category === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <cat.icon size={16} />
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300">
              {filteredMemes.length} memes found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>

          {filteredMemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">
                No memes found matching your criteria
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}