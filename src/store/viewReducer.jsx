"use client"
import {createSlice} from '@reduxjs/toolkit'

const def_portalDetail = {
    title: '',
    visible: false,
    risks: [],
    filter: []
}

export const viewSlice = createSlice({
    name: 'viewer',
    initialState: {
        portals: [],
        currentPortal: null,
        portalDetail: {...def_portalDetail}
    },
    reducers: {
        setPortals: (state, action) => {
            state.portals = action.payload
        },
        setCurrentPortal: (state, action) => {
            state.currentPortal = action.payload
        },
        setPortalDetail: (state, action) => {
            state.portalDetail = {...def_portalDetail, ...action.payload}
        },
        setPortalDetailVis: (state, action) => {
            state.portalDetail = {...state.portalDetail, ...action.payload}
        }
    },
})

export const {setPortals, setCurrentPortal, setPortalDetail, setPortalDetailVis} = viewSlice.actions

export default viewSlice.reducer