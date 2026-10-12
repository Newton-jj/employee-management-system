import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

function PerformanceTrendChart({
    trends = []
}) {

    const data = {
        labels: trends.map((item) => item.month),
        datasets: [
            {
                label: "Average Rating",
                data: trends.map((item) =>
                    Number(item.average_rating || 0)
                ),
                borderColor: "#198754",
                backgroundColor: "#198754",
                tension: 0.35
            },
            {
                label: "Declining Indicators",
                data: trends.map((item) =>
                    Number(item.declining_count || 0)
                ),
                borderColor: "#dc3545",
                backgroundColor: "#dc3545",
                tension: 0.35
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                position: "bottom"
            }
        }
    };

    return (

        <div className="card shadow p-4 chart-card">

            <h5 className="mb-4">
                Performance Trends
            </h5>

            <Line data={data} options={options} />

        </div>
    );
}

export default PerformanceTrendChart;
