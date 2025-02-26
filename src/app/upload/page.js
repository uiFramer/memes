'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { UploadIcon, ImageIcon, Wand2 } from 'lucide-react'
import { addUserMeme } from '../redux/slices/memesSlice'
import { toast } from 'sonner'

export default function Upload() {
  const dispatch = useDispatch()
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFile(e.dataTransfer.files[0])
  }

  // File handling
  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setSelectedImage(e.target.result)
      reader.readAsDataURL(file)
    } else {
      toast.error('Please upload an image file (JPG, PNG, GIF)')
    }
  }

  // AI Caption Generation (Mock - Replace with actual API call)
  const generateCaption = async () => {
    setIsGenerating(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const captions = [
       "When the junior dev says 'It works on my machine'...",
        "Me, deploying on a Friday afternoon...",
        "When the bug disappears after adding a console.log()",
        "Senior dev: 'Don’t push directly to main!' Me: git push origin main",
        "When you Google an error and the only result is your own Stack Overflow question",
        "Me, after fixing a bug I don't understand...",
        "That moment when you forget a semicolon and break everything",
        "Deploying to production like: 'Please don’t break... please don’t break...'",
        "When you see a 10-year-old JavaScript tutorial still being used in 2025",
        "Code review feedback: 'This works, but... why?'",
      ]
      setCaption(captions[Math.floor(Math.random() * captions.length)])
    } finally {
      setIsGenerating(false)
    }
  }

  // Image upload to ImgBB
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('image', selectedFile)

    const apiKey = "511b73c5f0a5ad51caadb947d108cdc1"

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        { method: 'POST', body: formData }
      )

      const data = await response.json()
      if (!data.success) throw new Error('Upload failed')

      dispatch(addUserMeme({
        id: Date.now().toString(),
        name: caption || 'My awesome meme',
        url: data.data.url,
        width: data.data.width,
        height: data.data.height,
      }))

      toast.success('Meme uploaded successfully!')
      setSelectedImage(null)
      setSelectedFile(null)
      setCaption('')
    } catch (error) {
      toast.error('Upload failed: ' + (error.message || 'Please try again'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-center mb-4 dark:text-white">
          Upload Your Meme
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Share your humor with the world! Upload your meme and add a funny caption.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-700'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedImage ? (
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg object-contain"
              />
              <button
                onClick={() => {
                  setSelectedImage(null)
                  setSelectedFile(null)
                }}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Drag and drop your meme here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
              <input
                type="file"
                onChange={(e) => handleFile(e.target.files[0])}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Caption Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a funny caption..."
              rows="1"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary resize-none"
            />
            <button
              onClick={generateCaption}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors disabled:opacity-50 h-min"
            >
              <Wand2 size={20} />
              <span>{isGenerating ? 'Generating...' : 'AI Caption'}</span>
            </button>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-75"
          >
            <UploadIcon size={20} />
            <span>{isUploading ? 'Uploading...' : 'Upload Meme'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}