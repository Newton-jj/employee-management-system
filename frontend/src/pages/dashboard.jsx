import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    FaFileExcel,
    FaFilePdf,
    FaMoneyCheckAlt
} from "react-icons/fa";

import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import DepartmentChart from "../components/charts/DepartmentChart";
import PerformanceDistributionChart from "../components/charts/PerformanceDistributionChart";
import TopPerformersLeaderboard from "../components/TopPerformersLeaderboard";
import { getEmployees } from "../services/employeeService";
import { getAttendanceAnalytics } from "../services/attendanceService";
import { getPerformanceDashboardAnalytics } from "../services/appraisalService";
import {
    downloadEmployeesExcel,
    downloadEmployeesPdf,
    downloadPayrollPdf
} from "../services/reportService";

function Dashboard({
    darkMode,
    setDarkMode
}) {

    const [employees, setEmployees] = useState([]);
    const [exporting, setExporting] = useState("");
    const [attendanceAnalytics, setAttendanceAnalytics] = useState({
        statusCounts: []
    });
    const [performanceAnalytics, setPerformanceAnalytics] = useState({
        distribution: [],
        topPerformers: [],
        departmentAnalytics: {
            bestDepartment: null,
            weakestDepartment: null
        }
    });

    useEffect(() => {
        fetchEmployees();
        fetchAttendanceSnapshot();
        fetchPerformanceSnapshot();
    }, []);

    const fetchEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAttendanceSnapshot = async () => {
        try {
            const data = await getAttendanceAnalytics();
            setAttendanceAnalytics(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPerformanceSnapshot = async () => {
        try {
            const data = await getPerformanceDashboardAnalytics();
            setPerformanceAnalytics(data);
        } catch (error) {
            console.log(error);
        }
    };

    const totalSalary = employees.reduce(
        (sum, employee) =>
            sum + Number(employee.salary || 0),
        0
    );

    const departments =
    new Set(
        employees.map((employee) =>
            employee.department
        )
    );

    const attendanceCountFor = (status) => {
        const item =
        attendanceAnalytics.statusCounts.find(
            (entry) => entry.status === status
        );

        return item?.count || 0;
    };

    const attendanceTotal =
    attendanceAnalytics.statusCounts.reduce(
        (sum, item) => sum + item.count,
        0
    );

    const attendanceRate =
    attendanceTotal > 0
    ? Math.round(
        (
            attendanceCountFor("Present") /
            attendanceTotal
        ) * 100
    )
    : 0;

    const handleExport =
    async (type, exportAction) => {
        try {
            setExporting(type);
            await exportAction();
            toast.success("Report downloaded");
        } catch (error) {
            toast.error("Unable to download report");
        } finally {
            setExporting("");
        }
    };

    return (

        <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
        >

            <h1 className="mb-4">
                Dashboard Analytics
            </h1>

            <div className="report-toolbar mb-4">

                <div>
                    <h5 className="mb-1">Reports</h5>
                    <p className="mb-0 text-muted">
                        Download employee and payroll summaries.
                    </p>
                </div>

                <div className="report-actions">

                    <button
                        className="btn btn-outline-danger"
                        disabled={exporting !== ""}
                        onClick={() =>
                        handleExport(
                            "employees-pdf",
                            downloadEmployeesPdf
                        )}
                    >
                        <FaFilePdf className="me-2" />
                        {
                            exporting === "employees-pdf"
                            ? "Preparing..."
                            : "Employee PDF"
                        }
                    </button>

                    <button
                        className="btn btn-outline-success"
                        disabled={exporting !== ""}
                        onClick={() =>
                        handleExport(
                            "employees-excel",
                            downloadEmployeesExcel
                        )}
                    >
                        <FaFileExcel className="me-2" />
                        {
                            exporting === "employees-excel"
                            ? "Preparing..."
                            : "Employee Excel"
                        }
                    </button>

                    <button
                        className="btn btn-dark"
                        disabled={exporting !== ""}
                        onClick={() =>
                        handleExport(
                            "payroll-pdf",
                            downloadPayrollPdf
                        )}
                    >
                        <FaMoneyCheckAlt className="me-2" />
                        {
                            exporting === "payroll-pdf"
                            ? "Preparing..."
                            : "Payroll PDF"
                        }
                    </button>

                </div>

            </div>

            <div className="row mb-4">

                <div className="col-md-3 mb-3">
                    <StatsCard
                        title="Total Employees"
                        value={employees.length}
                    />
                </div>

                <div className="col-md-3 mb-3">
                    <StatsCard
                        title="Departments"
                        value={departments.size}
                    />
                </div>

                <div className="col-md-3 mb-3">
                    <StatsCard
                        title="Total Salary"
                        value={`$${totalSalary}`}
                    />
                </div>

                <div className="col-md-3 mb-3">
                    <StatsCard
                        title="Attendance Rate"
                        value={`${attendanceRate}%`}
                    />
                </div>

            </div>

            <div className="row mb-4">

                <div className="col-md-4 mb-3">
                    <StatsCard
                        title="Present Today"
                        value={attendanceCountFor("Present")}
                    />
                </div>

                <div className="col-md-4 mb-3">
                    <StatsCard
                        title="Best Department"
                        value={
                            performanceAnalytics.departmentAnalytics
                            .bestDepartment?.department || "N/A"
                        }
                    />
                </div>

                <div className="col-md-4 mb-3">
                    <StatsCard
                        title="Needs Attention"
                        value={
                            performanceAnalytics.departmentAnalytics
                            .weakestDepartment?.department || "N/A"
                        }
                    />
                </div>

            </div>

            <div className="row">

                <div className="col-md-4 mb-4">
                    <DepartmentChart employees={employees} />
                </div>

                <div className="col-md-4 mb-4">
                    <PerformanceDistributionChart
                        distribution={
                            performanceAnalytics.distribution
                        }
                    />
                </div>

                <div className="col-md-4 mb-4">
                    <TopPerformersLeaderboard
                        performers={
                            performanceAnalytics.topPerformers
                        }
                    />
                </div>

            </div>

        </Layout>
    );
}

export default Dashboard;
