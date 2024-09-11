import {configureStore} from "@reduxjs/toolkit"
import tasksReducer from "./Features/tasksSlice"

export const store = configureStore({
    reducer:{
        tasksSlice: tasksReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;