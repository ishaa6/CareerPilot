import api from "./api";

export const createJob = async (jobData) => {
    const response = await api.post(
        "/job",
        jobData
    );

    return response.data;
};

export const listJobs = async () => {
    const response = await api.get("/job/");
 
    return response.data;
};