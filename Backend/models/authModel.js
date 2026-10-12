const db = require("../config/db");

const findAdminByEmail = async (email) => {

    const result = await db.query(
        "SELECT * FROM admins WHERE email = $1",
        [email]
    );

    return result.rows[0];
};

module.exports = {
    findAdminByEmail
};