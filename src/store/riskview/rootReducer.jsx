"use client";
import { createSlice } from '@reduxjs/toolkit';

export const rootSlice = createSlice({
    name: 'root',
    initialState: {
        activeUserId: null,
        userList: [],
        activePortalId: null,
        portals: [],
    },
    reducers: {
        setActivePortalId: (state, action) => {
            state.activePortalId = action.payload;
        },
        setPortals: (state, action) => {
            state.portals = action.payload;
        },
        setActiveUserId: (state, action) => {
            state.activeUserId = action.payload;
        },
        setUserList: (state, action) => {
            state.userList = action.payload;
        },
    },
});

export const { setPortals, setUserList, setActiveUserId, setActivePortalId } = rootSlice.actions;

export default rootSlice.reducer;