"use client";
import { createSlice } from '@reduxjs/toolkit';

export const viewSlice = createSlice({
    name: 'viewer',
    initialState: {
        portals: [],
        currentPortal: null
    },
    reducers: {
        setPortals: (state, action) => {
            state.portals = action.payload;
        },
        setCurrentPortal: (state, action) => {
            state.currentPortal = action.payload;
        },
    },
});

export const { setPortals, setCurrentPortal } = viewSlice.actions;

export default viewSlice.reducer;