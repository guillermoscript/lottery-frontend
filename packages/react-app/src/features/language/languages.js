import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState = {
    language: 'en',
}

export const changeLanguage = createAction('languages/changeLanguage')

export const languageReducer = createReducer(initialState, (builder) => {

    builder
        .addCase(changeLanguage, (state, action) => {
            state.language = action.payload.language
        })
})

export default languageReducer