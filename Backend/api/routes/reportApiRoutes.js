const express = require("express");

const router = express.Router();

const reportApiController =
require("../controllers/reportApiController");

router.get(
    "/employees/pdf",
    reportApiController.exportEmployeesPdf
);

router.get(
    "/employees/excel",
    reportApiController.exportEmployeesExcel
);

router.get(
    "/payroll/pdf",
    reportApiController.exportPayrollPdf
);

module.exports = router;
