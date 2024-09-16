import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


const baseUrl = "http://localhost:3000/"

const fetchData = async () => {
    const response = await axios.get(baseUrl + "tasks");
    return response.data;
};

export const fetchApiTasks = createAsyncThunk("tasks/fetchData", async () => {
    const tasks = await fetchData();
    return tasks;
});

interface tasksState {
    status: 'idle' | 'loading' | 'success' | 'failed';
    tasks: Task[];
    error: null
}

export interface Task {
    id: number;
    title: string;
    priority: string;
    description: string;
}

const initialTasksState: tasksState = {
    status: 'idle',
    tasks: [],
    error: null
};

export const tasksSlice = createSlice({
    name: "tasksSlice",
    initialState: initialTasksState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },

        editTask: (state, action: PayloadAction<Task>) => {
            const updatedTask = action.payload
            const updatedTasks = state.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            );
            state.tasks = updatedTasks
        },

        deleteTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchApiTasks.fulfilled, (state, action) => {
                state.status = "success";
                state.tasks = action.payload;
            })
            .addCase(fetchApiTasks.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { addTask, editTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer