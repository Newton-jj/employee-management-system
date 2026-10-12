import axios from "axios";

const API_URL =
"http://localhost:3000/api/reports";

const getHeaders = () => ({
    headers: {
        Authorization:
        `Bearer ${localStorage.getItem("token")}`
    },
    responseType: "blob"
});

const downloadReport = async (endpoint, filename) => {
    const response = await axios.get(
        `${API_URL}${endpoint}`,
        getHeaders()
    );

    const blobUrl =
    window.URL.createObjectURL(
        new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
};

export const downloadEmployeesPdf = () =>
    downloadReport(
        "/employees/pdf",
        "employee-report.pdf"
    );

export const downloadEmployeesExcel = () =>
    downloadReport(
        "/employees/excel",
        "employee-report.xlsx"
    );

export const downloadPayrollPdf = () =>
    downloadReport(
        "/payroll/pdf",
        "payroll-summary.pdf"
    );
