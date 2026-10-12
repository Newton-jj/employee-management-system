const express = require("express");

const router = express.Router();

const authController =
require("../controllers/authApiController");

// Login
router.post(
    "/login",
    authController.login
);

module.exports = router;