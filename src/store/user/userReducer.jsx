"use client"
import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'userInfo',
    initialState: {
        userId: null,
        userName: null,
        role: null
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.userId = action.payload?.userId;
            state.userName = action.payload?.userName;
            state.role = action.payload?.role;
        }
    }
})

export const {setUserInfo} = userSlice.actions

export default userSlice.reducer