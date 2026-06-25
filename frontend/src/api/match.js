import api from "./api";

export const matchResume = async (
    resumeId,
    jobId
) => {

    const response = await api.post(
        "/analyse/",
        null,
        {
            params: {
                resume_id: resumeId,
                job_id: jobId
            }
        }
    );

    return response.data;
};