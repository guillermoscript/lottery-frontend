import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState = {
    balanceOf: '',
	name: '',
	symbol: '',
	decimals: {},
	totalSupply: "",
	allowance: ''
}

export const addToken = createAction('token/info')

export const addBalanceOfToken = createAction('token/balance')

export const addAllowanceOfToken = createAction('token/allowance')

export const tokenReducer = createReducer(initialState, (builder) => {

	builder
		.addCase(addToken, (state, action) => {
			state.balanceOf = action.payload.balanceOf
			state.name = action.payload.name
			state.symbol = action.payload.symbol
			state.decimals = action.payload.decimals
			state.totalSupply = action.payload.totalSupply
			state.allowance = action.payload.allowance
		})
		.addCase(addBalanceOfToken, (state, action) => {
			state.balanceOf = action.payload.balanceOf
		})
		.addCase(addAllowanceOfToken, (state, action) => {
			state.allowance = action.payload.allowance
		})
})

export default tokenReducer