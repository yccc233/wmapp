"use client";
import { createSlice } from '@reduxjs/toolkit';

export const viewSlice = createSlice({
    name: 'viewer',
    initialState: {
        portals: [],
    },
    reducers: {
        setPortals: (state, action) => {
            state.portals = action.payload;
        },
    },
});

export const { setPortals } = viewSlice.actions;

export default viewSlice.reducer;