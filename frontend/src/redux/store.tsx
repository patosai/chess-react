import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux'
import gameReducer from './reducers/game';

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch