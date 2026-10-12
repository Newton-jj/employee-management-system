import axios from "axios";

const API_URL =
"http://localhost:3000/api/attendance";

const getHeaders = () => ({
    headers: {
        Authorization:
        `Bearer ${localStorage.getItem("token")}`
    }
});

export const getAttendance = async (filters = {}) => {
    const response =
    await axios.get(
        API_URL,
        {
            ...getHeaders(),
            params: filters
        }
    );

    return response.data.data;
};

export const markAttendance = async (attendanceData) => {
    const response =
    await axios.post(
        API_URL,
        attendanceData,
        getHeaders()
    );

    return response.data.data;
};

export const updateAttendance = async (id, attendanceData) => {
    const response =
    await axios.put(
        `${API_URL}/${id}`,
        attendanceData,
        getHeaders()
    );

    return response.data.data;
};

export const deleteAttendance = async (id) => {
    await axios.delete(
        `${API_URL}/${id}`,
        getHeaders()
    );
};

export const getAttendanceAnalytics = async (filters = {}) => {
    const response =
    await axios.get(
        `${API_URL}/analytics`,
        {
            ...getHeaders(),
            params: filters
        }
    );

    return response.data.data;
};

export const getEmployeeAttendanceHistory = async (employeeId) => {
    const response =
    await axios.get(
        `${API_URL}/employee/${employeeId}`,
        getHeaders()
    );

    return response.data.data;
};
