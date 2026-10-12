const express = require("express");
const http = require("http");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const { initSocket } = require("./services/socketService");

// Database
require("./config/db");

// ── Core Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ── Session & Flash ──────────────────────────────────────────────
app.use(session({
    secret: process.env.SESSION_SECRET || "fallback_secret_change_me",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// ── Static Files & View Engine ───────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ── Global Template Variables ────────────────────────────────────
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// ── JWT Middleware (for API routes) ──────────────────────────────
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

// ── API Routes ───────────────────────────────────────────────────
const authApiRoutes = require("./api/routes/authApiRoutes");
const employeeApiRoutes = require("./api/routes/employeeApiRoutes");
const reportApiRoutes = require("./api/routes/reportApiRoutes");
const notificationApiRoutes = require("./api/routes/notificationApiRoutes");
const attendanceApiRoutes = require("./api/routes/attendanceApiRoutes");
const appraisalApiRoutes = require("./api/routes/appraisalApiRoutes");

app.use("/api/auth", authApiRoutes);
app.use("/api/employees", verifyToken, employeeApiRoutes); // Protected
app.use("/api/reports", verifyToken, reportApiRoutes); // Protected
app.use("/api/notifications", verifyToken, notificationApiRoutes); // Protected
app.use("/api/attendance", verifyToken, attendanceApiRoutes); // Protected
app.use("/api/appraisals", verifyToken, appraisalApiRoutes); // Protected

// ── Web Routes ───────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const checkAuth = require("./middleware/authMiddleware");
const checkRole = require("./middleware/roleMiddleware");
const Employee = require("./models/employeeModel");

// Home
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Auth Routes (login/logout)
app.use("/", authRoutes);

// Protected Dashboard
app.get("/dashboard", checkAuth, async (req, res) => {
    try {
        const employees = await Employee.getAllEmployees();
        const totalEmployees = employees.length;

        res.render("dashboard", {
            employees,
            totalEmployees
        });
    } catch (err) {
        console.error("Error loading dashboard:", err);
        res.status(500).send("Error loading dashboard");
    }
});

// Protected Employee Routes
app.use("/employees", checkAuth, employeeRoutes);

// ── Start Server ─────────────────────────────────────────────────
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
