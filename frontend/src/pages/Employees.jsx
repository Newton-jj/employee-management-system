import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import EmployeeModal from "../components/EmployeeModal";
import {
    getEmployees,
    createEmployee,
    deleteEmployee
} from "../services/employeeService";
import { toast } from "react-toastify";

function Employees({

    darkMode,

    setDarkMode

}) {

    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {

        fetchEmployees();

    }, []);

    const fetchEmployees = async () => {

        try {

            const data = await getEmployees();

            setEmployees(data);

        } catch (error) {

            console.log(error);
        }
    };

    const handleSave = async (employeeData) => {

        try {

            await createEmployee(employeeData);

            toast.success("Employee Added");

            fetchEmployees();

        } catch (error) {

            toast.error("Error adding employee");
        }
    };

    const handleDelete = async (id) => {

        try {

            await deleteEmployee(id);

            toast.success("Employee Deleted");

            fetchEmployees();

        } catch (error) {

            toast.error("Delete failed");
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.full_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <Layout
            darkMode={darkMode}
            setDarkMode={setDarkMode}
        >

            <div className="d-flex justify-content-between mb-4">

                <h1>Employees</h1>

                <input
                    type="text"
                    placeholder="Search employee"
                    className="form-control w-25"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <EmployeeModal onSave={handleSave} />

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredEmployees.map((employee) => (

                        <tr key={employee.id}>

                            <td>{employee.id}</td>
                            <td>{employee.full_name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.department}</td>

                            <td>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </Layout>
    );
}

export default Employees;
