import { createAsyncThunk, createSlice, PayloadAction, combineReducers } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = 'http://localhost:3000/'

const fetchData = async () => {
    const response = await axios.get(baseUrl + "tasks");
    return response.data;
};

export const fetchApiTasks = createAsyncThunk("tasksSlice/fetchData", async () => {
    const tasks = await fetchData();
    return tasks;
});

interface tasksState {
    tasks: Task[];
}

export interface Task {
    id: number;
    title: string;
    priority: string;
    category: string;
    description: string;
    startDate: string;
    endDate: string;
}

const initialTasksState: tasksState = {
    tasks: [],
};

export const tasksSlice = createSlice({
    name: "tasksSlice",
    initialState: initialTasksState,
    reducers: {

    },
});

export const {  } = tasksSlice.actions;

export default tasksSlice.reducer