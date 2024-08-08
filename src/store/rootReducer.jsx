"use client";
import { createSlice } from '@reduxjs/toolkit';

export const rootSlice = createSlice({
    name: 'root',
    initialState: {
        userList: [],
        portals: [],
    },
    reducers: {
        setPortals: (state, action) => {
            state.portals = action.payload;
        },
        setUserList: (state, action) => {
            state.userList = action.payload;
        },
    },
});

export const { setPortals, setUserList } = rootSlice.actions;

export default rootSlice.reducer;