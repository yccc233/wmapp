"use client";
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import viewReducer from '@/src/store/riskview/viewReducer.jsx';
import rootReducer from '@/src/store/riskview/rootReducer.jsx';
import {Provider} from "react-redux";

const reducer = combineReducers({
    viewReducer,
    rootReducer
});

export const store = configureStore({
    reducer
});

export function ReduxProvider({children}) {
    return <Provider store={store}>{children}</Provider>;
}