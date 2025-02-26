'use client'

import { configureStore } from '@reduxjs/toolkit'
import darkModeReducer from './slices/darkModeSlice'
import memesReducer from './slices/memesSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    memes: memesReducer,
    user: userReducer,
  },
})