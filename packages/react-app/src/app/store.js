import { configureStore } from '@reduxjs/toolkit'
import accountReducer from '../features/login/wallet'
import lotteryReducer from '../features/lottery/lottery'
import tokenReducer from '../features/token/token'


export const store = configureStore({
  reducer: {
    accountReducer,
    lotteryReducer,
    tokenReducer    
  },
})