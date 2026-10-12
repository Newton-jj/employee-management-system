import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const ratingOrder = [
    { rating: 5, label: "Excellent" },
    { rating: 4, label: "Very Good" },
    { rating: 3, label: "Good" },
    { rating: 2, label: "Fair" },
    { rating: 1, label: "Poor" }
];

function PerformanceDistributionChart({
    distribution = []
}) {

    const data = {
        labels: ratingOrder.map((item) => item.label),
        datasets: [
            {
                label: "Ratings",
                data: ratingOrder.map((item) => {
                    const match =
                    distribution.find((entry) =>
                        Number(entry.rating) === item.rating
                    );

                    return match?.count || 0;
                }),
                backgroundColor: [
                    "#198754",
                    "#0d6efd",
                    "#6f42c1",
                    "#ffc107",
                    "#dc3545"
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom"
            }
        }
    };

    return (

        <div className="card shadow p-4 chart-card">

            <h5 className="mb-4">
                Performance Distribution
            </h5>

            <Doughnut data={data} options={options} />

        </div>
    );
}

export default PerformanceDistributionChart;
