const db = require("../config/db");

const createNotification = async ({
    type,
    title,
    message,
    metadata = {}
}) => {
    const result = await db.query(
        `
        INSERT INTO notifications
        (type, title, message, metadata)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            type,
            title,
            message,
            JSON.stringify(metadata)
        ]
    );

    return result.rows[0];
};

const getNotifications = async (limit = 20) => {
    const result = await db.query(
        `
        SELECT *
        FROM notifications
        ORDER BY created_at DESC
        LIMIT $1
        `,
        [limit]
    );

    return result.rows;
};

const getUnreadCount = async () => {
    const result = await db.query(
        `
        SELECT COUNT(*)::int AS count
        FROM notifications
        WHERE is_read = false
        `
    );

    return result.rows[0].count;
};

const markAsRead = async (id) => {
    const result = await db.query(
        `
        UPDATE notifications
        SET is_read = true
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};

const markAllAsRead = async () => {
    await db.query(
        `
        UPDATE notifications
        SET is_read = true
        WHERE is_read = false
        `
    );
};

module.exports = {
    createNotification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};
