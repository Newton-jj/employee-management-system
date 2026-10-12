const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const Auth =
require("../../models/authModel");

const login = async (req, res) => {
    try {

        const { email, password } =
        req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                "Email and password are required"
            });
        }

        const admin =
        await Auth.findAdminByEmail(
            email.trim().toLowerCase()
        );

        if (!admin) {

            return res.status(401).json({
                success: false,
                message:
                "Invalid credentials"
            });
        }

        const validPassword =
        await bcrypt.compare(
            password,
            admin.password
        );

        if (!validPassword) {

            return res.status(401).json({
                success: false,
                message:
                "Invalid credentials"
            });
        }

        // Generate JWT
        const token = jwt.sign(

            {
                id: admin.id,
                role: admin.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({

            success: true,

            token,

            user: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    login
};
