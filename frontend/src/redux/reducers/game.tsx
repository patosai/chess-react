import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Game } from '../../common/game'

export interface GameData {
  error: string | null,
  userId: number | null,
  username: string | null,
  gameId: number | null,
  gameData: Game | null,
}

const initialState: GameData = {
  error: null,
  userId: null,
  username: null,
  gameId: null,
  gameData: null,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
    clearUserId: (state) => {
      state.userId = null;
    },
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
    clearGameId: (state) => {
      state.gameId = null
    },
    setGameData: (state, action: PayloadAction<Game>) => {
      state.gameData = action.payload;
    },
    clearGameData: (state) => {
      state.gameData = null
    },
  },
  selectors: {
    selectUserId: (sliceState) => sliceState.userId,
    selectError: (sliceState) => sliceState.error,
    selectUsername: (sliceState) => sliceState.username,
    selectGameId: (sliceState) => sliceState.gameId,
    selectGameData: (sliceState) => sliceState.gameData,
  },
})

// Action creators are generated for each case reducer function
export const { setUsername, clearUsername, clearGameId, clearGameData, setError, clearError, setGameId, setGameData, setUserId, clearUserId } = gameSlice.actions
export const { selectError, selectUsername, selectGameId, selectGameData, selectUserId } = gameSlice.selectors
export default gameSlice.reducer