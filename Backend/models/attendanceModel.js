const db = require("../config/db");

const validStatuses = ["Present", "Absent", "Late", "Leave"];

const normalizeDate = (date) =>
    date || new Date().toISOString().slice(0, 10);

const assertValidStatus = (status) => {
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid attendance status");
    }
};

const markAttendance = async ({
    employee_id,
    attendance_date,
    status,
    notes
}) => {
    assertValidStatus(status);

    const result = await db.query(
        `
        INSERT INTO attendance
        (employee_id, attendance_date, status, notes)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (employee_id, attendance_date)
        DO UPDATE SET
            status = EXCLUDED.status,
            notes = EXCLUDED.notes,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [
            employee_id,
            normalizeDate(attendance_date),
            status,
            notes || null
        ]
    );

    return getAttendanceById(result.rows[0].id);
};

const getAttendanceById = async (id) => {
    const result = await db.query(
        `
        SELECT
            a.*,
            e.full_name,
            e.email,
            e.department,
            e.position
        FROM attendance a
        JOIN employees e ON e.id = a.employee_id
        WHERE a.id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const getAttendance = async ({
    date,
    status,
    department
}) => {
    const values = [];
    const conditions = [];

    if (date) {
        values.push(date);
        conditions.push(`a.attendance_date = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`a.status = $${values.length}`);
    }

    if (department) {
        values.push(department);
        conditions.push(`e.department = $${values.length}`);
    }

    const whereClause =
    conditions.length > 0
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

    const result = await db.query(
        `
        SELECT
            a.*,
            e.full_name,
            e.email,
            e.department,
            e.position
        FROM attendance a
        JOIN employees e ON e.id = a.employee_id
        ${whereClause}
        ORDER BY a.attendance_date DESC, e.full_name ASC
        `,
        values
    );

    return result.rows;
};

const getEmployeeHistory = async (employeeId) => {
    const result = await db.query(
        `
        SELECT
            a.*,
            e.full_name,
            e.email,
            e.department,
            e.position
        FROM attendance a
        JOIN employees e ON e.id = a.employee_id
        WHERE a.employee_id = $1
        ORDER BY a.attendance_date DESC
        `,
        [employeeId]
    );

    return result.rows;
};

const updateAttendance = async ({
    id,
    status,
    notes
}) => {
    assertValidStatus(status);

    const result = await db.query(
        `
        UPDATE attendance
        SET
            status = $1,
            notes = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
        `,
        [status, notes || null, id]
    );

    if (!result.rows[0]) {
        return null;
    }

    return getAttendanceById(result.rows[0].id);
};

const deleteAttendance = async (id) => {
    const result = await db.query(
        `
        DELETE FROM attendance
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};

const getAnalytics = async ({
    date,
    month
}) => {
    const selectedDate = normalizeDate(date);
    const selectedMonth =
    month || selectedDate.slice(0, 7);

    const statusCounts = await db.query(
        `
        SELECT status, COUNT(*)::int AS count
        FROM attendance
        WHERE attendance_date = $1
        GROUP BY status
        `,
        [selectedDate]
    );

    const dailyTrend = await db.query(
        `
        SELECT
            attendance_date,
            status,
            COUNT(*)::int AS count
        FROM attendance
        WHERE attendance_date >= CURRENT_DATE - INTERVAL '29 days'
        GROUP BY attendance_date, status
        ORDER BY attendance_date ASC
        `
    );

    const departmentStats = await db.query(
        `
        SELECT
            COALESCE(e.department, 'Unassigned') AS department,
            a.status,
            COUNT(*)::int AS count
        FROM attendance a
        JOIN employees e ON e.id = a.employee_id
        WHERE TO_CHAR(a.attendance_date, 'YYYY-MM') = $1
        GROUP BY COALESCE(e.department, 'Unassigned'), a.status
        ORDER BY department ASC
        `,
        [selectedMonth]
    );

    const monthlySummary = await db.query(
        `
        SELECT status, COUNT(*)::int AS count
        FROM attendance
        WHERE TO_CHAR(attendance_date, 'YYYY-MM') = $1
        GROUP BY status
        `,
        [selectedMonth]
    );

    return {
        date: selectedDate,
        month: selectedMonth,
        statusCounts: statusCounts.rows,
        dailyTrend: dailyTrend.rows,
        departmentStats: departmentStats.rows,
        monthlySummary: monthlySummary.rows
    };
};

module.exports = {
    validStatuses,
    markAttendance,
    getAttendance,
    getAttendanceById,
    getEmployeeHistory,
    updateAttendance,
    deleteAttendance,
    getAnalytics
};
