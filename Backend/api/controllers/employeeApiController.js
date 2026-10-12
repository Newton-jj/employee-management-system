const Employee =
require("../../models/employeeModel");

const { notify } =
require("../../services/notificationService");

// GET all employees
const getEmployees = async (req, res) => {

    try {

        const employees =
        await Employee.getAllEmployees();

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET single employee
const getEmployee = async (req, res) => {

    try {

        const employee =
        await Employee.getEmployeeById(
            req.params.id
        );

        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE employee
const createEmployee = async (req, res) => {

    try {

        const {
            full_name,
            email,
            phone,
            department,
            position,
            salary
        } = req.body;

        const employee =
        await Employee.addEmployee(
            full_name,
            email,
            phone,
            department,
            position,
            salary || null,
            null
        );

        await notify({
            type: "employee_added",
            title: "Employee Added",
            message: `${employee.full_name} was added to the system.`,
            metadata: {
                employeeId: employee.id,
                department: employee.department
            }
        });

        res.status(201).json({
            success: true,
            message: "Employee created",
            data: employee
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE employee
const updateEmployee = async (req, res) => {

    try {

        const {
            full_name,
            email,
            phone,
            department,
            position,
            salary
        } = req.body;

        const employee =
        await Employee.updateEmployee(
            req.params.id,
            full_name,
            email,
            phone,
            department,
            position,
            salary || null
        );

        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        await notify({
            type: "employee_updated",
            title: "Employee Updated",
            message: `${employee.full_name} was updated.`,
            metadata: {
                employeeId: employee.id,
                department: employee.department
            }
        });

        res.status(200).json({
            success: true,
            message: "Employee updated",
            data: employee
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE employee
const deleteEmployee = async (req, res) => {

    try {

        const employee =
        await Employee.getEmployeeById(
            req.params.id
        );

        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        await Employee.deleteEmployee(req.params.id);

        await notify({
            type: "employee_deleted",
            title: "Employee Deleted",
            message: `${employee.full_name} was removed from the system.`,
            metadata: {
                employeeId: employee.id,
                department: employee.department
            }
        });

        res.status(200).json({
            success: true,
            message: "Employee deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
