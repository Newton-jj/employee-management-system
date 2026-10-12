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

const statuses = ["Present", "Absent", "Late", "Leave"];

function AttendanceStatusChart({ statusCounts = [] }) {

    const counts =
    statuses.map((status) => {
        const item =
        statusCounts.find((entry) =>
            entry.status === status
        );

        return item?.count || 0;
    });

    const data = {
        labels: statuses,
        datasets: [
            {
                label: "Attendance",
                data: counts,
                backgroundColor: [
                    "#198754",
                    "#dc3545",
                    "#ffc107",
                    "#0d6efd"
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
                Daily Attendance Mix
            </h5>

            <Doughnut data={data} options={options} />

        </div>
    );
}

export default AttendanceStatusChart;
