import axios from "axios";

export const useApi = axios.create({
    baseURL: "http://localhost:3000/",
    headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
    },
});

export const fetchData = async (endpoint: string) => {
    const response = await useApi.get(endpoint);
    return response.data;
};

export const createData = async (endpoint: string, data: any) => {
    const response = await useApi.post(endpoint, data);
    return response.data;
};

export const updateData = async (endpoint: string, data: any) => {
    const response = await useApi.put(endpoint, data);
    return response.data;
};

export const deleteData = async (endpoint: string) => {
    const response = await useApi.delete(endpoint);
    return response.data;
};