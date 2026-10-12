const express = require("express");

const router = express.Router();

const authController =
require("../controllers/authController");

// Login page
router.get("/login",
    authController.loginPage
);

// Login
router.post("/login",
    authController.loginUser
);

// Logout
router.get("/logout",
    authController.logoutUser
);

module.exports = router;