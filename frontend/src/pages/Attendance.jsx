import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import AttendanceStatusChart from "../components/charts/AttendanceStatusChart";
import DailyAttendanceTrendChart from "../components/charts/DailyAttendanceTrendChart";
import DepartmentAttendanceChart from "../components/charts/DepartmentAttendanceChart";
import { getEmployees } from "../services/employeeService";
import {
    getAttendance,
    getAttendanceAnalytics,
    markAttendance
} from "../services/attendanceService";

const statuses = ["Present", "Absent", "Late", "Leave"];

const today = () =>
    new Date().toISOString().slice(0, 10);

function Attendance({
    darkMode,
    setDarkMode
}) {

    const [employees, setEmployees] = useState([]);
    const [records, setRecords] = useState([]);
    const [analytics, setAnalytics] = useState({
        statusCounts: [],
        dailyTrend: [],
        departmentStats: [],
        monthlySummary: []
    });

    const [filters, setFilters] = useState({
        date: today(),
        status: "",
        department: ""
    });

    const [formData, setFormData] = useState({
        employee_id: "",
        attendance_date: today(),
        status: "Present",
        notes: ""
    });

    const departments = useMemo(() =>
        [...new Set(
            employees
                .map((employee) => employee.department)
                .filter(Boolean)
        )],
        [employees]
    );

    useEffect(() => {
        loadEmployees();
        loadAttendance();
    }, []);

    useEffect(() => {
        loadAttendance();
    }, [
        filters.date,
        filters.status,
        filters.department
    ]);

    useEffect(() => {
        loadAnalytics();
    }, [filters.date]);

    const loadEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadAttendance = async () => {
        try {
            const data = await getAttendance({
                date: filters.date,
                status: filters.status || undefined,
                department: filters.department || undefined
            });

            setRecords(data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadAnalytics = async () => {
        try {
            const data =
            await getAttendanceAnalytics({
                date: filters.date,
                month: filters.date.slice(0, 7)
            });

            setAnalytics(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((current) => ({
            ...current,
            [name]: value
        }));

        if (name === "date") {
            setFormData((current) => ({
                ...current,
                attendance_date: value
            }));
        }
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.employee_id) {
            toast.error("Select an employee");
            return;
        }

        try {
            await markAttendance(formData);
            toast.success("Attendance marked");

            setFormData((current) => ({
                ...current,
                employee_id: "",
                notes: ""
            }));

            await loadAttendance();
            await loadAnalytics();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to mark attendance"
            );
        }
    };

    const countFor = (status) => {
        const item =
        analytics.statusCounts.find((entry) =>
            entry.status === status
        );

        return item?.count || 0;
    };

    const dailyTotal =
    analytics.statusCounts.reduce(
        (sum, item) => sum + item.count,
        0
    );

    const attendanceRate =
    dailyTotal > 0
    ? Math.round((countFor("Present") / dailyTotal) * 100)
    : 0;

    return (

        <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
        >

            <div className="attendance-header mb-4">

                <div>

                    <h1 className="mb-1">
                        Attendance
                    </h1>

                    <p className="text-muted mb-0">
                        Mark daily attendance and review workforce trends.
                    </p>

                </div>

            </div>

            <div className="row mb-4">

                <div className="col-md-3 mb-3">
                    <StatsCard
                        title="Present Today"
                        value={countFor("Present")}
                    />
                </div>

                <div className="col-md-3 mb-3">
                    <StatsCard
                        title="Absent Today"
                        value={countFor("Absent")}
                    />
                </div>

                <div className="col-md-3 mb-3">
                    <StatsCard
                        title="Late Today"
                        value={countFor("Late")}
                    />
                </div>

                <div className="col-md-3 mb-3">
                    <StatsCard
                        title="Attendance Rate"
                        value={`${attendanceRate}%`}
                    />
                </div>

            </div>

            <div className="attendance-panel mb-4">

                <form
                    className="attendance-form"
                    onSubmit={handleSubmit}
                >

                    <select
                        name="employee_id"
                        className="form-control"
                        value={formData.employee_id}
                        onChange={handleFormChange}
                    >
                        <option value="">
                            Select employee
                        </option>

                        {employees.map((employee) => (
                            <option
                                key={employee.id}
                                value={employee.id}
                            >
                                {employee.full_name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        name="attendance_date"
                        className="form-control"
                        value={formData.attendance_date}
                        onChange={handleFormChange}
                    />

                    <select
                        name="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleFormChange}
                    >
                        {statuses.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="notes"
                        className="form-control"
                        placeholder="Notes"
                        value={formData.notes}
                        onChange={handleFormChange}
                    />

                    <button className="btn btn-dark">
                        Mark Attendance
                    </button>

                </form>

            </div>

            <div className="attendance-panel mb-4">

                <div className="attendance-filters">

                    <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={filters.date}
                        onChange={handleFilterChange}
                    />

                    <select
                        name="status"
                        className="form-control"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">
                            All statuses
                        </option>

                        {statuses.map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>

                    <select
                        name="department"
                        className="form-control"
                        value={filters.department}
                        onChange={handleFilterChange}
                    >
                        <option value="">
                            All departments
                        </option>

                        {departments.map((department) => (
                            <option
                                key={department}
                                value={department}
                            >
                                {department}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            <div className="row mb-4">

                <div className="col-lg-4 mb-4">
                    <AttendanceStatusChart
                        statusCounts={analytics.statusCounts}
                    />
                </div>

                <div className="col-lg-8 mb-4">
                    <DailyAttendanceTrendChart
                        dailyTrend={analytics.dailyTrend}
                    />
                </div>

                <div className="col-12">
                    <DepartmentAttendanceChart
                        departmentStats={analytics.departmentStats}
                    />
                </div>

            </div>

            <div className="table-responsive attendance-table">

                <table className="table table-bordered table-hover">

                    <thead className="table-dark">

                        <tr>
                            <th>Date</th>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>

                    </thead>

                    <tbody>

                        {records.map((record) => (
                            <tr key={record.id}>
                                <td>
                                    {new Date(
                                        record.attendance_date
                                    ).toLocaleDateString()}
                                </td>
                                <td>{record.full_name}</td>
                                <td>{record.department}</td>
                                <td>{record.position}</td>
                                <td>
                                    <span className={`status-pill status-${record.status.toLowerCase()}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td>{record.notes || "-"}</td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </Layout>
    );
}

export default Attendance;
