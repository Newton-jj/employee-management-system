const express = require("express");

const router = express.Router();

const notificationApiController =
require("../controllers/notificationApiController");

router.get(
    "/",
    notificationApiController.getNotifications
);

router.get(
    "/unread-count",
    notificationApiController.getUnreadCount
);

router.patch(
    "/read-all",
    notificationApiController.markAllAsRead
);

router.patch(
    "/:id/read",
    notificationApiController.markAsRead
);

module.exports = router;
