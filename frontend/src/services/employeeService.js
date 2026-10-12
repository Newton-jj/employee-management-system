import axios from "axios";

const API_URL =
"http://localhost:3000/api/employees";

const getHeaders = () => ({

    headers: {
        Authorization:
        `Bearer ${localStorage.getItem("token")}`
    }
});

// GET employees
export const getEmployees =
async () => {

    const response =
    await axios.get(
        API_URL,
        getHeaders()
    );

    return response.data.data;
};

// CREATE employee
export const createEmployee =
async (employeeData) => {

    return await axios.post(
        API_URL,
        employeeData,
        getHeaders()
    );
};

// DELETE employee
export const deleteEmployee =
async (id) => {

    return await axios.delete(
        `${API_URL}/${id}`,
        getHeaders()
    );
};
