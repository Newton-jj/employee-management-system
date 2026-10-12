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

const statuses = ["Present", "Absent", "Late", "Leave"];

const colors = {
    Present: "#198754",
    Absent: "#dc3545",
    Late: "#ffc107",
    Leave: "#0d6efd"
};

const formatDate = (dateValue) =>
    new Date(dateValue).toLocaleDateString([], {
        month: "short",
        day: "numeric"
    });

function DailyAttendanceTrendChart({ dailyTrend = [] }) {

    const labels =
    [...new Set(
        dailyTrend.map((entry) =>
            entry.attendance_date
        )
    )];

    const data = {
        labels: labels.map(formatDate),
        datasets: statuses.map((status) => ({
            label: status,
            data: labels.map((date) => {
                const item =
                dailyTrend.find((entry) =>
                    entry.attendance_date === date &&
                    entry.status === status
                );

                return item?.count || 0;
            }),
            borderColor: colors[status],
            backgroundColor: colors[status],
            tension: 0.35
        }))
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    return (

        <div className="card shadow p-4 chart-card">

            <h5 className="mb-4">
                30-Day Attendance Trend
            </h5>

            <Line data={data} options={options} />

        </div>
    );
}

export default DailyAttendanceTrendChart;
