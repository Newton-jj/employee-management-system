const db = require("../config/db");

const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
};

const appraisalSelect = `
    SELECT
        a.*,
        e.full_name,
        e.email,
        COALESCE(a.department, e.department) AS department,
        e.position,
        c.name AS category_name,
        c.description AS category_description,
        ${ratingCase()} AS rating_label
    FROM appraisals a
    JOIN employees e ON e.id = a.employee_id
    JOIN appraisal_categories c ON c.id = a.category_id
`;

function ratingCase(alias = "a") {
    return `
        CASE ${alias}.rating
            WHEN 1 THEN 'Poor'
            WHEN 2 THEN 'Fair'
            WHEN 3 THEN 'Good'
            WHEN 4 THEN 'Very Good'
            WHEN 5 THEN 'Excellent'
        END
    `;
}

const getCategories = async () => {
    const result = await db.query(
        `
        SELECT *
        FROM appraisal_categories
        ORDER BY name ASC
        `
    );

    return result.rows;
};

const getAppraisals = async ({
    search,
    department,
    rating,
    category_id,
    date,
    page = 1,
    limit = 10
}) => {
    const values = [];
    const conditions = [];

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`
            (
                e.full_name ILIKE $${values.length} OR
                e.email ILIKE $${values.length} OR
                a.reviewer_name ILIKE $${values.length}
            )
        `);
    }

    if (department) {
        values.push(department);
        conditions.push(`COALESCE(a.department, e.department) = $${values.length}`);
    }

    if (rating) {
        values.push(Number(rating));
        conditions.push(`a.rating = $${values.length}`);
    }

    if (category_id) {
        values.push(Number(category_id));
        conditions.push(`a.category_id = $${values.length}`);
    }

    if (date) {
        values.push(date);
        conditions.push(`a.appraisal_date = $${values.length}`);
    }

    const where =
    conditions.length > 0
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const offset = (safePage - 1) * safeLimit;

    const countResult = await db.query(
        `
        SELECT COUNT(*)::int AS total
        FROM appraisals a
        JOIN employees e ON e.id = a.employee_id
        JOIN appraisal_categories c ON c.id = a.category_id
        ${where}
        `,
        values
    );

    values.push(safeLimit);
    values.push(offset);

    const dataResult = await db.query(
        `
        ${appraisalSelect}
        ${where}
        ORDER BY a.appraisal_date DESC, a.created_at DESC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
        `,
        values
    );

    return {
        data: dataResult.rows,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total: countResult.rows[0].total,
            totalPages: Math.ceil(countResult.rows[0].total / safeLimit)
        }
    };
};

const getAppraisalById = async (id) => {
    const result = await db.query(
        `
        ${appraisalSelect}
        WHERE a.id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const getEmployeeHistory = async (employeeId) => {
    const result = await db.query(
        `
        ${appraisalSelect}
        WHERE a.employee_id = $1
        ORDER BY a.appraisal_date DESC, a.created_at DESC
        `,
        [employeeId]
    );

    return result.rows;
};

const createAppraisal = async (payload) => {
    const result = await db.query(
        `
        INSERT INTO appraisals
        (
            employee_id,
            review_id,
            category_id,
            reviewer_name,
            rating,
            comments,
            appraisal_date,
            department,
            recommendation_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
            payload.employee_id,
            payload.review_id || null,
            payload.category_id,
            payload.reviewer_name.trim(),
            Number(payload.rating),
            payload.comments || null,
            payload.appraisal_date,
            payload.department || null,
            payload.recommendation_status
        ]
    );

    return getAppraisalById(result.rows[0].id);
};

const updateAppraisal = async (id, payload) => {
    const result = await db.query(
        `
        UPDATE appraisals
        SET
            employee_id = $1,
            review_id = $2,
            category_id = $3,
            reviewer_name = $4,
            rating = $5,
            comments = $6,
            appraisal_date = $7,
            department = $8,
            recommendation_status = $9,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
        `,
        [
            payload.employee_id,
            payload.review_id || null,
            payload.category_id,
            payload.reviewer_name.trim(),
            Number(payload.rating),
            payload.comments || null,
            payload.appraisal_date,
            payload.department || null,
            payload.recommendation_status,
            id
        ]
    );

    if (!result.rows[0]) {
        return null;
    }

    return getAppraisalById(result.rows[0].id);
};

const deleteAppraisal = async (id) => {
    const result = await db.query(
        `
        DELETE FROM appraisals
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};

const getTopPerformers = async (limit = 5) => {
    const result = await db.query(
        `
        SELECT
            e.id AS employee_id,
            e.full_name,
            e.department,
            e.position,
            ROUND(AVG(a.rating)::numeric, 2) AS average_rating,
            COUNT(a.id)::int AS appraisal_count,
            RANK() OVER (ORDER BY AVG(a.rating) DESC, COUNT(a.id) DESC) AS rank
        FROM appraisals a
        JOIN employees e ON e.id = a.employee_id
        GROUP BY e.id, e.full_name, e.department, e.position
        HAVING COUNT(a.id) > 0
        ORDER BY average_rating DESC, appraisal_count DESC
        LIMIT $1
        `,
        [Number(limit) || 5]
    );

    return result.rows;
};

const getRatingDistribution = async () => {
    const result = await db.query(
        `
        SELECT
            rating,
            ${ratingCase()} AS rating_label,
            COUNT(*)::int AS count
        FROM appraisals a
        GROUP BY rating
        ORDER BY rating DESC
        `
    );

    return result.rows;
};

const getDepartmentAnalytics = async () => {
    const result = await db.query(
        `
        SELECT
            COALESCE(a.department, e.department, 'Unassigned') AS department,
            ROUND(AVG(a.rating)::numeric, 2) AS average_rating,
            COUNT(a.id)::int AS appraisal_count,
            COUNT(*) FILTER (WHERE a.rating <= 2)::int AS declining_count,
            COUNT(*) FILTER (WHERE a.rating >= 4)::int AS strong_count
        FROM appraisals a
        JOIN employees e ON e.id = a.employee_id
        GROUP BY COALESCE(a.department, e.department, 'Unassigned')
        ORDER BY average_rating DESC
        `
    );

    const departments = result.rows;

    return {
        departments,
        bestDepartment: departments[0] || null,
        weakestDepartment: departments[departments.length - 1] || null
    };
};

const getPerformanceTrends = async () => {
    const result = await db.query(
        `
        SELECT
            TO_CHAR(appraisal_date, 'YYYY-MM') AS month,
            ROUND(AVG(rating)::numeric, 2) AS average_rating,
            COUNT(*)::int AS appraisal_count,
            COUNT(*) FILTER (WHERE rating <= 2)::int AS declining_count,
            COUNT(*) FILTER (WHERE rating >= 4)::int AS strong_count
        FROM appraisals
        WHERE appraisal_date >= CURRENT_DATE - INTERVAL '11 months'
        GROUP BY TO_CHAR(appraisal_date, 'YYYY-MM')
        ORDER BY month ASC
        `
    );

    return result.rows;
};

const getDashboardAnalytics = async () => {
    const [
        distribution,
        topPerformers,
        departmentAnalytics,
        trends
    ] = await Promise.all([
        getRatingDistribution(),
        getTopPerformers(5),
        getDepartmentAnalytics(),
        getPerformanceTrends()
    ]);

    return {
        ratingLabels,
        distribution,
        topPerformers,
        departmentAnalytics,
        trends
    };
};

module.exports = {
    ratingLabels,
    getCategories,
    getAppraisals,
    getAppraisalById,
    getEmployeeHistory,
    createAppraisal,
    updateAppraisal,
    deleteAppraisal,
    getTopPerformers,
    getRatingDistribution,
    getDepartmentAnalytics,
    getPerformanceTrends,
    getDashboardAnalytics
};
