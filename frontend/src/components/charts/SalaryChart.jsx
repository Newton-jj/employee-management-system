import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function SalaryChart({ employees }) {

    const labels = employees.map((employee) =>
        employee.full_name || "Unknown"
    );

    const salaries = employees.map((employee) =>
        Number(employee.salary || 0)
    );

    const data = {

        labels,

        datasets: [
            {
                label: "Salary",
                data: salaries,
                backgroundColor: [
                    "#0d6efd",
                    "#198754",
                    "#ffc107",
                    "#dc3545",
                    "#6f42c1"
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            },
            title: {
                display: false
            }
        }
    };

    return (

        <div className="card shadow p-4">

            <h5 className="mb-4">
                Employee Salaries
            </h5>

            <Bar data={data} options={options} />

        </div>
    );
}

export default SalaryChart;
