import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import AppraisalEditModal from "../components/AppraisalEditModal";
import PerformanceDistributionChart from "../components/charts/PerformanceDistributionChart";
import DepartmentPerformanceChart from "../components/charts/DepartmentPerformanceChart";
import PerformanceTrendChart from "../components/charts/PerformanceTrendChart";
import TopPerformersLeaderboard from "../components/TopPerformersLeaderboard";
import { getEmployees } from "../services/employeeService";
import {
    createAppraisal,
    deleteAppraisal,
    getAppraisalCategories,
    getAppraisals,
    getPerformanceDashboardAnalytics,
    updateAppraisal
} from "../services/appraisalService";

const today = () =>
    new Date().toISOString().slice(0, 10);

const recommendations = [
    "Promotion Recommended",
    "Salary Review Recommended",
    "Needs Improvement",
    "Training Required"
];

function Appraisals({
    darkMode,
    setDarkMode
}) {

    const [employees, setEmployees] = useState([]);
    const [categories, setCategories] = useState([]);
    const [appraisals, setAppraisals] = useState([]);
    const [analytics, setAnalytics] = useState({
        distribution: [],
        topPerformers: [],
        departmentAnalytics: {
            departments: [],
            bestDepartment: null,
            weakestDepartment: null
        },
        trends: []
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);

    const [filters, setFilters] = useState({
        search: "",
        department: "",
        rating: "",
        date: "",
        page: 1,
        limit: 10
    });

    const [formData, setFormData] = useState({
        employee_id: "",
        category_id: "",
        reviewer_name: "",
        rating: "5",
        comments: "",
        appraisal_date: today(),
        department: "",
        recommendation_status: "Promotion Recommended"
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
        loadInitialData();
    }, []);

    useEffect(() => {
        loadAppraisals();
    }, [
        filters.search,
        filters.department,
        filters.rating,
        filters.date,
        filters.page
    ]);

    const loadInitialData = async () => {
        try {
            const [
                employeeData,
                categoryData,
                analyticsData
            ] = await Promise.all([
                getEmployees(),
                getAppraisalCategories(),
                getPerformanceDashboardAnalytics()
            ]);

            setEmployees(employeeData);
            setCategories(categoryData);
            setAnalytics(analyticsData);

            setFormData((current) => ({
                ...current,
                category_id: categoryData[0]?.id || ""
            }));
        } catch (error) {
            toast.error("Unable to load appraisal data");
        } finally {
            setLoading(false);
        }
    };

    const loadAppraisals = async () => {
        try {
            const result =
            await getAppraisals(filters);

            setAppraisals(result.data);
            setPagination(result.pagination);
        } catch (error) {
            toast.error("Unable to load appraisals");
        }
    };

    const refreshAnalytics = async () => {
        const data =
        await getPerformanceDashboardAnalytics();

        setAnalytics(data);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        if (name === "employee_id") {
            const employee =
            employees.find((item) =>
                String(item.id) === String(value)
            );

            setFormData((current) => ({
                ...current,
                employee_id: value,
                department: employee?.department || ""
            }));

            return;
        }

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((current) => ({
            ...current,
            [name]: value,
            page: 1
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.employee_id || !formData.category_id) {
            toast.error("Select an employee and category");
            return;
        }

        try {
            setSaving(true);
            await createAppraisal(formData);
            toast.success("Appraisal created");

            setFormData((current) => ({
                ...current,
                employee_id: "",
                reviewer_name: "",
                comments: "",
                rating: "5",
                appraisal_date: today(),
                department: "",
                recommendation_status: "Promotion Recommended"
            }));

            await loadAppraisals();
            await refreshAnalytics();
        } catch (error) {
            toast.error(
                error.response?.data?.errors?.[0] ||
                error.response?.data?.message ||
                "Unable to create appraisal"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (id, payload) => {
        try {
            await updateAppraisal(id, payload);
            toast.success("Appraisal updated");
            setEditing(null);
            await loadAppraisals();
            await refreshAnalytics();
        } catch (error) {
            toast.error(
                error.response?.data?.errors?.[0] ||
                "Unable to update appraisal"
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAppraisal(id);
            toast.success("Appraisal deleted");
            await loadAppraisals();
            await refreshAnalytics();
        } catch (error) {
            toast.error("Unable to delete appraisal");
        }
    };

    const averageRating =
    analytics.trends.length > 0
    ? analytics.trends[analytics.trends.length - 1].average_rating
    : "0.00";

    if (loading) {
        return (
            <Layout
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            >
                <div className="loading-panel">
                    Loading appraisal dashboard...
                </div>
            </Layout>
        );
    }

    return (

        <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
        >

            <div className="appraisal-header mb-4">
                <div>
                    <h1 className="mb-1">
                        Appraisal Dashboard
                    </h1>
                    <p className="text-muted mb-0">
                        Manage performance reviews, recommendations, and analytics.
                    </p>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <StatsCard
                        title="Average Rating"
                        value={averageRating}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <StatsCard
                        title="Best Department"
                        value={
                            analytics.departmentAnalytics.bestDepartment
                            ?.department || "N/A"
                        }
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <StatsCard
                        title="Needs Attention"
                        value={
                            analytics.departmentAnalytics.weakestDepartment
                            ?.department || "N/A"
                        }
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-lg-4 mb-4">
                    <PerformanceDistributionChart
                        distribution={analytics.distribution}
                    />
                </div>
                <div className="col-lg-4 mb-4">
                    <TopPerformersLeaderboard
                        performers={analytics.topPerformers}
                    />
                </div>
                <div className="col-lg-4 mb-4">
                    <DepartmentPerformanceChart
                        departments={
                            analytics.departmentAnalytics.departments
                        }
                    />
                </div>
                <div className="col-12">
                    <PerformanceTrendChart
                        trends={analytics.trends}
                    />
                </div>
            </div>

            <div className="appraisal-panel mb-4">
                <form
                    className="appraisal-form"
                    onSubmit={handleSubmit}
                >
                    <select
                        name="employee_id"
                        className="form-control"
                        value={formData.employee_id}
                        onChange={handleFormChange}
                    >
                        <option value="">Employee</option>
                        {employees.map((employee) => (
                            <option
                                key={employee.id}
                                value={employee.id}
                            >
                                {employee.full_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="category_id"
                        className="form-control"
                        value={formData.category_id}
                        onChange={handleFormChange}
                    >
                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="reviewer_name"
                        className="form-control"
                        placeholder="Reviewer name"
                        value={formData.reviewer_name}
                        onChange={handleFormChange}
                    />

                    <select
                        name="rating"
                        className="form-control"
                        value={formData.rating}
                        onChange={handleFormChange}
                    >
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                    </select>

                    <input
                        type="date"
                        name="appraisal_date"
                        className="form-control"
                        value={formData.appraisal_date}
                        onChange={handleFormChange}
                    />

                    <input
                        name="department"
                        className="form-control"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleFormChange}
                    />

                    <select
                        name="recommendation_status"
                        className="form-control"
                        value={formData.recommendation_status}
                        onChange={handleFormChange}
                    >
                        {recommendations.map((recommendation) => (
                            <option
                                key={recommendation}
                                value={recommendation}
                            >
                                {recommendation}
                            </option>
                        ))}
                    </select>

                    <textarea
                        name="comments"
                        className="form-control appraisal-comments"
                        placeholder="Comments and feedback"
                        value={formData.comments}
                        onChange={handleFormChange}
                    />

                    <button
                        className="btn btn-dark"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Create Appraisal"}
                    </button>
                </form>
            </div>

            <div className="appraisal-panel mb-4">
                <div className="appraisal-filters">
                    <input
                        name="search"
                        className="form-control"
                        placeholder="Search employee or reviewer"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                    <select
                        name="department"
                        className="form-control"
                        value={filters.department}
                        onChange={handleFilterChange}
                    >
                        <option value="">All departments</option>
                        {departments.map((department) => (
                            <option
                                key={department}
                                value={department}
                            >
                                {department}
                            </option>
                        ))}
                    </select>
                    <select
                        name="rating"
                        className="form-control"
                        value={filters.rating}
                        onChange={handleFilterChange}
                    >
                        <option value="">All ratings</option>
                        <option value="5">Excellent</option>
                        <option value="4">Very Good</option>
                        <option value="3">Good</option>
                        <option value="2">Fair</option>
                        <option value="1">Poor</option>
                    </select>
                    <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={filters.date}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>

            <div className="table-responsive appraisal-table">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Category</th>
                            <th>Rating</th>
                            <th>Reviewer</th>
                            <th>Recommendation</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appraisals.map((appraisal) => (
                            <tr key={appraisal.id}>
                                <td>{appraisal.full_name}</td>
                                <td>{appraisal.department}</td>
                                <td>{appraisal.category_name}</td>
                                <td>
                                    <span className={`rating-pill rating-${appraisal.rating}`}>
                                        {appraisal.rating} - {appraisal.rating_label}
                                    </span>
                                </td>
                                <td>{appraisal.reviewer_name}</td>
                                <td>{appraisal.recommendation_status}</td>
                                <td>
                                    {new Date(
                                        appraisal.appraisal_date
                                    ).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setEditing(appraisal)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                            handleDelete(appraisal.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination-bar">
                <button
                    className="btn btn-outline-secondary"
                    disabled={pagination.page <= 1}
                    onClick={() =>
                    setFilters((current) => ({
                        ...current,
                        page: current.page - 1
                    }))}
                >
                    Previous
                </button>

                <span>
                    Page {pagination.page} of {pagination.totalPages || 1}
                </span>

                <button
                    className="btn btn-outline-secondary"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() =>
                    setFilters((current) => ({
                        ...current,
                        page: current.page + 1
                    }))}
                >
                    Next
                </button>
            </div>

            <AppraisalEditModal
                appraisal={editing}
                employees={employees}
                categories={categories}
                onClose={() => setEditing(null)}
                onSave={handleUpdate}
            />

        </Layout>
    );
}

export default Appraisals;
