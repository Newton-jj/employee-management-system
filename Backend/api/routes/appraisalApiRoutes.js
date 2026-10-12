const express = require("express");

const router = express.Router();

const appraisalApiController =
require("../controllers/appraisalApiController");

const {
    validateAppraisal
} = require("../../middleware/appraisalValidation");

const {
    requireApiRole
} = require("../../middleware/apiRoleMiddleware");

router.use(
    requireApiRole(
        "superadmin",
        "admin",
        "hr",
        "manager"
    )
);

router.get(
    "/categories",
    appraisalApiController.getCategories
);

router.get(
    "/analytics/dashboard",
    appraisalApiController.getDashboardAnalytics
);

router.get(
    "/analytics/departments",
    appraisalApiController.getDepartmentAnalytics
);

router.get(
    "/top-performers",
    appraisalApiController.getTopPerformers
);

router.get(
    "/employee/:id",
    appraisalApiController.getEmployeeHistory
);

router.get(
    "/",
    appraisalApiController.getAppraisals
);

router.post(
    "/",
    validateAppraisal,
    appraisalApiController.createAppraisal
);

router.put(
    "/:id",
    validateAppraisal,
    appraisalApiController.updateAppraisal
);

router.delete(
    "/:id",
    appraisalApiController.deleteAppraisal
);

module.exports = router;
