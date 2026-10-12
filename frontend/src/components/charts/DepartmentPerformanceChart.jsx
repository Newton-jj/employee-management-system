import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

function DepartmentPerformanceChart({
    departments = []
}) {

    const data = {
        labels: departments.map((item) => item.department),
        datasets: [
            {
                label: "Average Rating",
                data: departments.map((item) =>
                    Number(item.average_rating || 0)
                ),
                backgroundColor: "#0d6efd"
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 5
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (

        <div className="card shadow p-4 chart-card">

            <h5 className="mb-4">
                Department Performance
            </h5>

            <Bar data={data} options={options} />

        </div>
    );
}

export default DepartmentPerformanceChart;
