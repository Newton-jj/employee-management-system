const bcrypt = require("bcrypt");

const Auth = require("../models/authModel");

// Login page
const loginPage = (req, res) => {

    res.render("login", {
        message: req.flash("message")
    });
};

// Login user
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const admin =
        await Auth.findAdminByEmail(email);

        if (!admin) {

            req.flash(
                "message",
                "Invalid email or password"
            );

            return res.redirect("/login");
        }

        const validPassword =
        await bcrypt.compare(
            password,
            admin.password
        );

        if (!validPassword) {

            req.flash(
                "message",
                "Invalid email or password"
            );

            return res.redirect("/login");
        }

        // Save session
        req.session.user = {
            id: admin.id,
            username: admin.username,
            role: admin.role
        };

        res.redirect("/dashboard");

    } catch (error) {

        console.log(error);
    }
};

// Logout
const logoutUser = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");
    });
};

module.exports = {
    loginPage,
    loginUser,
    logoutUser
};