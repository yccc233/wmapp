"use client";

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import viewReducer from './viewReducer';
import { Provider } from "react-redux";

const rootReducer = combineReducers({
    viewReducer
});

export const store = configureStore({
    reducer: rootReducer
});

export function ReduxProvider({ children }) {
    return <Provider store={store}>{children}</Provider>;
}