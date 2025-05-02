'use client'

import { createSlice } from '@reduxjs/toolkit'

// Load initial state from localStorage if available
const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedProfile = localStorage.getItem('userProfile')
    return {
      profile: savedProfile ? JSON.parse(savedProfile) : {
        name: 'Anonymous',
        bio: 'Bio',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      }
    }
  }
  return {
    profile: {
      name: 'Anonymous',
      bio: 'Bio',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    }
  }
}

const initialState = loadInitialState()

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
      // Save to localStorage whenever profile is updated
      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfile', JSON.stringify(state.profile))
      }
    },
  },
})

export const { updateProfile } = userSlice.actions
export default userSlice.reducer
