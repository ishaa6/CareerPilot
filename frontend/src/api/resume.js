import api from './api'

export const uploadResume = async(file) => {
    const formData = new FormData();

    formData.append("file", file)

    const response = await api.post(
        "/resume/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
}

export const getResume = async(resumeId) => {
    const response = await api.get(
        `/resume/${resumeId}`
    );

    return response.data;
}