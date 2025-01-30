"use client";
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import viewReducer from '@/src/store/riskview/viewReducer.jsx';
import rootReducer from '@/src/store/riskview/rootReducer.jsx';
import userReducer from '@/src/store/user/userReducer.jsx';
import {Provider} from "react-redux";

const reducer = combineReducers({
    viewReducer,
    rootReducer,
    userReducer
});

const store = configureStore({
    reducer
});

export function ReduxProvider({children}) {
    return <Provider store={store}>{children}</Provider>;
}