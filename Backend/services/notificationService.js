const Notification = require("../models/notificationModel");
const { emitNotification } = require("./socketService");

const notify = async ({
    type,
    title,
    message,
    metadata
}) => {
    try {
        const notification =
        await Notification.createNotification({
            type,
            title,
            message,
            metadata
        });

        emitNotification(notification);

        return notification;
    } catch (error) {
        console.error("Notification error:", error.message);
        return null;
    }
};

module.exports = {
    notify
};
