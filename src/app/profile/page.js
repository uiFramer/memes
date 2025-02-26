'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Pencil, Save, ImageIcon } from 'lucide-react'
import { updateProfile } from '../redux/slices/userSlice'
import MemeCard from '../components/MemeCard'

export default function Profile() {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user)
  const { memes, userMemes, likedMemes } = useSelector((state) => state.memes)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [activeTab, setActiveTab] = useState('uploads')
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    setEditedProfile(profile)
  }, [profile])

  const likedMemesData = likedMemes.map((likedId) => {
    const userMeme = userMemes.find((meme) => meme.id === likedId)
    if (userMeme) return userMeme
    const apiMeme = memes.find((meme) => meme.id === likedId)
    return apiMeme || null
  }).filter(Boolean)

  const handleSave = () => {
    dispatch(updateProfile({ ...editedProfile, avatar: selectedImage || profile.avatar }))
    setIsEditing(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: 'uploads', label: 'Your Uploads' },
    { id: 'liked', label: 'Liked Memes' },
  ]

  return (
    <div className="space-y-8 lg:p-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <img
                src={selectedImage || profile.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white cursor-pointer">
                  <ImageIcon size={16} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, name: e.target.value })
                  }
                  className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none dark:text-white"
                />
              ) : (
                <h1 className="text-2xl font-bold dark:text-white">{profile.name}</h1>
              )}
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, bio: e.target.value })
                  }
                  className="w-full bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:border-primary dark:text-gray-300"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
              )}
            </div>
          </div>

          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {isEditing ? <Save size={20} /> : <Pencil size={20} />}
            <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'uploads'
          ? userMemes.map((meme) => <MemeCard key={meme.id} meme={meme} />)
          : likedMemesData.map((meme) => <MemeCard key={meme.id} meme={meme} />)}
      </div>
    </div>
  )
}