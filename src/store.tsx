import {configureStore} from "@reduxjs/toolkit"
import tasksReducer from "./Features/tasksSlice"
import categoriesReducer from "./Features/categoriesSlice";

export const store = configureStore({
    reducer:{
        tasksSlice: tasksReducer,
        categoriesSlice: categoriesReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;