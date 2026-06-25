import api from "./api";

export const listHistory = async () => {
    const response = await api.get("/history/");

    return response.data;
};

export const getHistoryItem = async (id) => {
    const response = await api.get(`/history/${id}`);

    return response.data;
};

export const deleteHistoryItem = async (id) => {
    const response = await api.delete(`/history/${id}`);

    return response.data;
};
