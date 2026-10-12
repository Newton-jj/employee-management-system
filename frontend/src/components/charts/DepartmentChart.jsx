import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function DepartmentChart({ employees }) {

    const departmentCounts = {};

    employees.forEach((employee) => {

        const dept = employee.department || "Unknown";

        departmentCounts[dept] =
        (departmentCounts[dept] || 0) + 1;
    });

    const data = {

        labels: Object.keys(departmentCounts),

        datasets: [
            {
                label: "Departments",
                data: Object.values(departmentCounts),
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
                position: "bottom"
            }
        }
    };

    return (

        <div className="card shadow p-4">

            <h5 className="mb-4">
                Employees by Department
            </h5>

            <Pie data={data} options={options} />

        </div>
    );
}

export default DepartmentChart;
