const db = require("../config/db");

// Get all employees
const getAllEmployees = async () => {
    const result = await db.query(
        "SELECT * FROM employees ORDER BY id DESC"
    );

    return result.rows;
};

// Add employee
const addEmployee = async (
    full_name,
    email,
    phone,
    department,
    position,
    salary,
    photo = null
) => {

    const query = `
        INSERT INTO employees
        (full_name, email, phone, department, position, salary, photo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const result = await db.query(query, [
        full_name,
        email,
        phone,
        department,
        position,
        salary,
        photo
    ]);

    return result.rows[0];
};

// Get single employee
const getEmployeeById = async (id) => {

    const result = await db.query(
        "SELECT * FROM employees WHERE id = $1",
        [id]
    );

    return result.rows[0];
};

// Update employee
const updateEmployee = async (
    id,
    full_name,
    email,
    phone,
    department,
    position,
    salary
) => {

    const query = `
        UPDATE employees
        SET
            full_name = $1,
            email = $2,
            phone = $3,
            department = $4,
            position = $5,
            salary = $6
        WHERE id = $7
        RETURNING *
    `;

    const result = await db.query(query, [
        full_name,
        email,
        phone,
        department,
        position,
        salary,
        id
    ]);

    return result.rows[0];
};

// Delete employee
const deleteEmployee = async (id) => {

    await db.query(
        "DELETE FROM employees WHERE id = $1",
        [id]
    );
};

// Search employees
const searchEmployees = async (searchTerm) => {

    const query = `
        SELECT *
        FROM employees
        WHERE
            full_name ILIKE $1 OR
            department ILIKE $1 OR
            position ILIKE $1
        ORDER BY id DESC
    `;

    const result = await db.query(query, [`%${searchTerm}%`]);

    return result.rows;
};

module.exports = {
    getAllEmployees,
    addEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    searchEmployees
};
