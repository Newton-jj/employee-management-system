const Employee = require("../models/employeeModel");



// Display employees
const showEmployees = async (req, res) => {

    try {

        const employees = await Employee.getAllEmployees();

        res.render("employees", {
            employees
        });

    } catch (error) {
        console.log(error);
    }
};

// Add employee
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

        const photo =
req.file ? req.file.filename : null;

        await Employee.addEmployee(
            full_name,
            email,
            phone,
            department,
            position,
            salary,
            photo
        );

        res.redirect("/employees");

    } catch (error) {
        console.log(error);
    }
};

// Edit page
const editEmployeePage = async (req, res) => {

    try {

        const employee = await Employee.getEmployeeById(
            req.params.id
        );

        res.render("editEmployee", {
            employee
        });

    } catch (error) {
        console.log(error);
    }
};

// Update employee
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

        await Employee.updateEmployee(
            req.params.id,
            full_name,
            email,
            phone,
            department,
            position,
            salary

        );

        res.redirect("/employees");

    } catch (error) {
        console.log(error);
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {

    try {

        await Employee.deleteEmployee(req.params.id);

        res.redirect("/employees");

    } catch (error) {
        console.log(error);
    }
};

// Search
const searchEmployee = async (req, res) => {

    try {

        const search = req.query.search || "";

        const employees = await Employee.searchEmployees(search);

        res.render("employees", {
            employees
        });

    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    showEmployees,
    createEmployee,
    editEmployeePage,
    updateEmployee,
    deleteEmployee,
    searchEmployee
};