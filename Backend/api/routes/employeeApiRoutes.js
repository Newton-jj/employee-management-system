const express = require("express");

const router = express.Router();

const employeeApiController =
require("../controllers/employeeApiController");

// GET all employees
router.get("/",
    employeeApiController.getEmployees
);

// GET single employee
router.get("/:id",
    employeeApiController.getEmployee
);

// CREATE employee
router.post("/",
    employeeApiController.createEmployee
);

// UPDATE employee
router.put("/:id",
    employeeApiController.updateEmployee
);

// DELETE employee
router.delete("/:id",
    employeeApiController.deleteEmployee
);

module.exports = router;