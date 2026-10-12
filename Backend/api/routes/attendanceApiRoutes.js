const express = require("express");

const router = express.Router();

const attendanceApiController =
require("../controllers/attendanceApiController");

router.get(
    "/",
    attendanceApiController.getAttendance
);

router.post(
    "/",
    attendanceApiController.markAttendance
);

router.get(
    "/analytics",
    attendanceApiController.getAnalytics
);

router.get(
    "/employee/:id",
    attendanceApiController.getEmployeeHistory
);

router.put(
    "/:id",
    attendanceApiController.updateAttendance
);

router.delete(
    "/:id",
    attendanceApiController.deleteAttendance
);

module.exports = router;
