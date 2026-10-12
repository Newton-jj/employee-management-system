const express = require("express");

const router = express.Router();

const employeeController =
require("../controllers/employeeController");

const checkRole =
require("../middleware/roleMiddleware");

const upload =
require("../middleware/uploadMiddleware");

// Display employees
router.get("/", employeeController.showEmployees);

// Add employee
router.post("/add", 

upload.single("photo"),
    
 employeeController.createEmployee
);

// Edit page
router.get("/edit/:id",
    employeeController.editEmployeePage
);

// Update employee
router.post("/update/:id",
    employeeController.updateEmployee
);

// Delete employee
router.get("/delete/:id",
     checkRole(["superadmin"]),
    employeeController.deleteEmployee
);

// Search employee
router.get("/search",
    employeeController.searchEmployee
);

module.exports = router;