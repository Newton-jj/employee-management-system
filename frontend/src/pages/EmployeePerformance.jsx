import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import { getEmployeeAppraisalHistory } from "../services/appraisalService";

function EmployeePerformance({
    darkMode,
    setDarkMode
}) {

    const { id } = useParams();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, [id]);

    const loadHistory = async () => {
        try {
            const data =
            await getEmployeeAppraisalHistory(id);

            setHistory(data);
        } catch (error) {
            toast.error("Unable to load performance history");
        }
    };

    const average =
    history.length > 0
    ? (
        history.reduce(
            (sum, item) => sum + Number(item.rating),
            0
        ) / history.length
    ).toFixed(2)
    : "0.00";

    return (

        <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
        >

            <h1 className="mb-4">
                Employee Performance
            </h1>

            <div className="row mb-4">
                <div className="col-md-4">
                    <StatsCard
                        title="Appraisals"
                        value={history.length}
                    />
                </div>
                <div className="col-md-4">
                    <StatsCard
                        title="Average Rating"
                        value={average}
                    />
                </div>
                <div className="col-md-4">
                    <StatsCard
                        title="Latest Rating"
                        value={history[0]?.rating_label || "N/A"}
                    />
                </div>
            </div>

            <div className="table-responsive appraisal-table">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Rating</th>
                            <th>Reviewer</th>
                            <th>Recommendation</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {new Date(
                                        item.appraisal_date
                                    ).toLocaleDateString()}
                                </td>
                                <td>{item.category_name}</td>
                                <td>{item.rating_label}</td>
                                <td>{item.reviewer_name}</td>
                                <td>{item.recommendation_status}</td>
                                <td>{item.comments || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </Layout>
    );
}

export default EmployeePerformance;
