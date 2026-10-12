import axios from "axios";

const API_URL =
"http://localhost:3000/api/appraisals";

const getHeaders = () => ({
    headers: {
        Authorization:
        `Bearer ${localStorage.getItem("token")}`
    }
});

export const getAppraisalCategories = async () => {
    const response =
    await axios.get(
        `${API_URL}/categories`,
        getHeaders()
    );

    return response.data.data;
};

export const getAppraisals = async (filters = {}) => {
    const response =
    await axios.get(
        API_URL,
        {
            ...getHeaders(),
            params: filters
        }
    );

    return {
        data: response.data.data,
        pagination: response.data.pagination
    };
};

export const createAppraisal = async (appraisalData) => {
    const response =
    await axios.post(
        API_URL,
        appraisalData,
        getHeaders()
    );

    return response.data.data;
};

export const updateAppraisal = async (id, appraisalData) => {
    const response =
    await axios.put(
        `${API_URL}/${id}`,
        appraisalData,
        getHeaders()
    );

    return response.data.data;
};

export const deleteAppraisal = async (id) => {
    await axios.delete(
        `${API_URL}/${id}`,
        getHeaders()
    );
};

export const getEmployeeAppraisalHistory = async (employeeId) => {
    const response =
    await axios.get(
        `${API_URL}/employee/${employeeId}`,
        getHeaders()
    );

    return response.data.data;
};

export const getTopPerformers = async () => {
    const response =
    await axios.get(
        `${API_URL}/top-performers`,
        getHeaders()
    );

    return response.data.data;
};

export const getDepartmentPerformanceAnalytics = async () => {
    const response =
    await axios.get(
        `${API_URL}/analytics/departments`,
        getHeaders()
    );

    return response.data.data;
};

export const getPerformanceDashboardAnalytics = async () => {
    const response =
    await axios.get(
        `${API_URL}/analytics/dashboard`,
        getHeaders()
    );

    return response.data.data;
};
