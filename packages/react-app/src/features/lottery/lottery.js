import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState = {
	entryFee: '',
	LotteryState: {},
	sizeOfTicket: '',
	numbersEntered: {},
	tokenAddress: "",
	allowance: 0
}

export const addnumbersEntered = createAction('lottery/numbersEntered')
export const addEntryFee = createAction('lottery/entryFee')
export const addAllowance = createAction('lottery/allowance')

export const lotteryReducer = createReducer(initialState, (builder) => {

	builder
		.addCase(addnumbersEntered, (state, action) => {
			// state.entryFee = action.payload.entryFee
			// state.sizeOfTicket = action.payload.sizeOfTicket
			state.numbersEntered = action.payload.numbersEntered
			// state.tokenAddress = action.payload.tokenAddress
		})
		.addCase(addEntryFee , (state, action) => {
			state.entryFee = action.payload.entryFee
		})
		.addCase(addAllowance, (state,action) => {
			state.allowance = action.payload.allowance
		})
})

export default lotteryReducer