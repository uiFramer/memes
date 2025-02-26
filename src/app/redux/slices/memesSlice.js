'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchMemes = createAsyncThunk('memes/fetchMemes', async () => {
  const response = await axios.get('https://api.imgflip.com/get_memes')
  return response.data.data.memes
})

// Load initial state from localStorage if available
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedState = {
        memes: [],
        loading: false,
        error: null,
        userMemes: JSON.parse(localStorage.getItem('userMemes') || '[]'),
        likedMemes: JSON.parse(localStorage.getItem('likedMemes') || '[]'),
      }

      // Validate likedMemes is an array
      if (!Array.isArray(savedState.likedMemes)) {
        savedState.likedMemes = []
        localStorage.setItem('likedMemes', '[]')
      }

      // Validate userMemes is an array
      if (!Array.isArray(savedState.userMemes)) {
        savedState.userMemes = []
        localStorage.setItem('userMemes', '[]')
      }

      return savedState
    } catch (error) {
      console.error('Error loading state from localStorage:', error)
      return {
        memes: [],
        loading: false,
        error: null,
        userMemes: [],
        likedMemes: [],
      }
    }
  }
  return {
    memes: [],
    loading: false,
    error: null,
    userMemes: [],
    likedMemes: [],
  }
}

const initialState = loadInitialState()

export const memesSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {
    addUserMeme: (state, action) => {
      state.userMemes.unshift(action.payload)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('userMemes', JSON.stringify(state.userMemes))
        } catch (error) {
          console.error('Error saving userMemes to localStorage:', error)
        }
      }
    },
    toggleLikeMeme: (state, action) => {
      const memeId = action.payload
      const likedIndex = state.likedMemes.indexOf(memeId)
      
      if (likedIndex === -1) {
        state.likedMemes.push(memeId)
      } else {
        state.likedMemes.splice(likedIndex, 1)
      }
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('likedMemes', JSON.stringify(state.likedMemes))
        } catch (error) {
          console.error('Error saving likedMemes to localStorage:', error)
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemes.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.loading = false
        state.memes = action.payload
      })
      .addCase(fetchMemes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { addUserMeme, toggleLikeMeme } = memesSlice.actions
export default memesSlice.reducer