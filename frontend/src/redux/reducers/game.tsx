import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface gameState {
  error: string | null,
  username: string | null,
}

const initialState: gameState = {
  error: null,
  username: null,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    clearUsername: (state) => {
      state.username = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectError: (sliceState) => sliceState.error,
    selectUsername: (sliceState) => sliceState.username,
  },
})

// Action creators are generated for each case reducer function
export const { setUsername, clearUsername, setError, clearError } = gameSlice.actions
export const { selectError, selectUsername } = gameSlice.selectors
export default gameSlice.reducer