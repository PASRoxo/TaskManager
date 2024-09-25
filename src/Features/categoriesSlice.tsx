import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:3000/"

const fetchData = async (url: string) => {
    const response = await axios.get(baseUrl + url);
    return response.data;
};

export const fetchApiCategories = createAsyncThunk("categories/fetchData", async () => {
    const categories = await fetchData('categories');
    return categories;
});

export interface Category {
    id: number;
    name: string;
    colorCode: string;
    description: string;
}

interface categoriesState {
    status: 'idle' | 'loading' | 'success' | 'failed';
    categories: Category[];
    error: null
}

const initialCategoriesState: categoriesState = {
    status: 'idle',
    categories: [],
    error: null
};

export const categoriesSlice = createSlice({
    name: "categoriesSlice",
    initialState: initialCategoriesState,
    reducers: {
        addCategory: (state, action: PayloadAction<Category>) => {
            state.categories.push(action.payload);
        },

        editCategory: (state, action: PayloadAction<Category>) => {
            const updatedCategory = action.payload
            const updatedCategories = state.categories.map((category) =>
                category.id === updatedCategory.id ? updatedCategory : category
            );
            state.categories = updatedCategories
        },

        deleteCategory: (state, action: PayloadAction<number>) => {
            state.categories = state.categories.filter(category => category.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            //////////// Categories ////////////
            .addCase(fetchApiCategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchApiCategories.fulfilled, (state, action) => {
                state.status = "success";
                state.categories = action.payload;
            })
            .addCase(fetchApiCategories.rejected, (state) => {
                state.status = "failed";
            })
    },
});

export const { addCategory, editCategory, deleteCategory } = categoriesSlice.actions;

export default categoriesSlice.reducer