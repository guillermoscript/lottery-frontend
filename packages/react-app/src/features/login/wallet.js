import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState = {
  isConnected: false,
  account: '',
  networkName: '',
  accountBalanceEth: ''
}

export const addAccounts = createAction('user/accounts')

export const accountReducer = createReducer(initialState, (builder) => {

  builder
    .addCase(addAccounts, (state, action) => {
      state.isConnected = action.payload.isConnected
      state.account = action.payload.account
      state.networkName = action.payload.networkName
      state.accountBalanceEth = action.payload.accountBalanceEth
    })
})

export default accountReducer