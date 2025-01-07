import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchData } from "../Components/apiRequests";

export const fetchApiTaskTypes = createAsyncThunk("task_types/fetchData", async () => {
    const taskTypes = await fetchData('task_types');
    return taskTypes;
});

export const fetchApiTasks = createAsyncThunk("tasks/fetchData", async () => {
    const tasks = await fetchData('tasks');
    return tasks;
});

export interface Task {
    id: string;
    title: string;
    category?: string;
    type: string;
    priority?: string;
    description?: string;
}

export interface TaskType {
    id: string;
    display: string;
    fields: string[];
    required: string[];
}

interface tasksState {
    status: 'idle' | 'loading' | 'success' | 'failed';
    tasks: Task[];
    taskTypes: TaskType[];
    error: null
}

const initialTasksState: tasksState = {
    status: 'idle',
    tasks: [],
    taskTypes: [],
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

        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            //////////// Tasks ////////////
            .addCase(fetchApiTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchApiTasks.fulfilled, (state, action) => {
                state.status = "success";
                state.tasks = action.payload;
            })
            .addCase(fetchApiTasks.rejected, (state) => {
                state.status = "failed";
            })


            //////////// Task Types ////////////
            .addCase(fetchApiTaskTypes.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchApiTaskTypes.fulfilled, (state, action) => {
                state.status = "success";
                state.taskTypes = action.payload;
            })
            .addCase(fetchApiTaskTypes.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { addTask, editTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer