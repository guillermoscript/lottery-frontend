import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../features/login/wallet'

export const store = configureStore({
  reducer: {
    accountReducer
  },
})