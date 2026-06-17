import api from "./api";

export const createJob = async (jobData) => {
    const response = await api.post(
        "/job",
        jobData
    );

    return response.data;
};