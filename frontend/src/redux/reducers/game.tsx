import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface gameState {
  error: string | null,
  username: string | null,
  gameId: number | null,
  gameState: string[][] | null,
}

const initialState: gameState = {
  error: null,
  username: null,
  gameId: null,
  gameState: null,
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
    setGameId: (state, action: PayloadAction<number>) => {
      state.gameId = action.payload;
    },
    setGameState: (state, action: PayloadAction<string[][]>) => {
      state.gameState = action.payload;
    },
  },
  selectors: {
    selectError: (sliceState) => sliceState.error,
    selectUsername: (sliceState) => sliceState.username,
    selectGameId: (sliceState) => sliceState.gameId,
    selectGameState: (sliceState) => sliceState.gameState,
  },
})

// Action creators are generated for each case reducer function
export const { setUsername, clearUsername, setError, clearError, setGameId, setGameState } = gameSlice.actions
export const { selectError, selectUsername, selectGameId, selectGameState } = gameSlice.selectors
export default gameSlice.reducer