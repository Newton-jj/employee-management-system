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

const statuses = ["Present", "Absent", "Late", "Leave"];

const colors = {
    Present: "#198754",
    Absent: "#dc3545",
    Late: "#ffc107",
    Leave: "#0d6efd"
};

function DepartmentAttendanceChart({ departmentStats = [] }) {

    const departments =
    [...new Set(
        departmentStats.map((entry) =>
            entry.department
        )
    )];

    const data = {
        labels: departments,
        datasets: statuses.map((status) => ({
            label: status,
            data: departments.map((department) => {
                const item =
                departmentStats.find((entry) =>
                    entry.department === department &&
                    entry.status === status
                );

                return item?.count || 0;
            }),
            backgroundColor: colors[status]
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
            x: {
                stacked: true
            },
            y: {
                stacked: true,
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
                Department Attendance
            </h5>

            <Bar data={data} options={options} />

        </div>
    );
}

export default DepartmentAttendanceChart;
