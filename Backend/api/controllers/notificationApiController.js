const Notification =
require("../../models/notificationModel");

const getNotifications = async (req, res) => {
    try {
        const limit =
        Number(req.query.limit || 20);

        const notifications =
        await Notification.getNotifications(limit);

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const count =
        await Notification.getUnreadCount();

        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification =
        await Notification.markAsRead(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.markAllAsRead();

        res.status(200).json({
            success: true,
            message: "Notifications marked as read"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};
