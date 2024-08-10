"use client";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import viewReducer from '@/src/store/viewReducer';
import rootReducer from '@/src/store/rootReducer';
import { Provider } from "react-redux";

const allReducer = combineReducers({
    viewReducer,
    rootReducer
});

export const store = configureStore({
    reducer: allReducer
});

export function ReduxProvider({ children }) {
    return <Provider store={store}>{children}</Provider>;
}