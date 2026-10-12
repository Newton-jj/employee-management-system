import { useEffect, useRef, useState } from "react";
import { FaBell, FaCheckDouble } from "react-icons/fa";
import { toast } from "react-toastify";

import {
    createNotificationSocket,
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from "../services/notificationService";

function NotificationBell() {

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {

        loadNotifications();

        const socket = createNotificationSocket();
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        socket.on("notification:new", (notification) => {
            setNotifications((current) => [
                notification,
                ...current.slice(0, 19)
            ]);

            setUnreadCount((count) => count + 1);

            toast.info(notification.message);
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    const loadNotifications = async () => {

        try {

            const [items, count] =
            await Promise.all([
                getNotifications(),
                getUnreadNotificationCount()
            ]);

            setNotifications(items);
            setUnreadCount(count);

        } catch (error) {

            console.log(error);
        }
    };

    const handleMarkOne = async (notification) => {

        if (notification.is_read) {
            return;
        }

        try {

            const updated =
            await markNotificationAsRead(notification.id);

            setNotifications((current) =>
                current.map((item) =>
                    item.id === updated.id
                    ? updated
                    : item
                )
            );

            setUnreadCount((count) =>
                Math.max(count - 1, 0)
            );

        } catch (error) {

            console.log(error);
        }
    };

    const handleMarkAll = async () => {

        try {

            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    is_read: true
                }))
            );

            setUnreadCount(0);

        } catch (error) {

            console.log(error);
        }
    };

    const formatTime = (dateValue) =>
        new Date(dateValue).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    return (

        <div className="notification-wrapper">

            <button
                className="notification-button"
                onClick={() => setOpen((value) => !value)}
                title={
                    connected
                    ? "Notifications connected"
                    : "Notifications offline"
                }
            >
                <FaBell />

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (

                <div className="notification-panel shadow">

                    <div className="notification-panel-header">

                        <div>

                            <strong>Notifications</strong>

                            <small>
                                {connected ? "Live" : "Offline"}
                            </small>

                        </div>

                        <button
                            className="notification-mark-all"
                            onClick={handleMarkAll}
                            disabled={unreadCount === 0}
                            title="Mark all as read"
                        >
                            <FaCheckDouble />
                        </button>

                    </div>

                    <div className="notification-list">

                        {notifications.length === 0 ? (

                            <div className="notification-empty">
                                No notifications yet
                            </div>

                        ) : notifications.map((notification) => (

                            <button
                                key={notification.id}
                                className={
                                    notification.is_read
                                    ? "notification-item"
                                    : "notification-item unread"
                                }
                                onClick={()=>
                                handleMarkOne(notification)}
                            >
                                <span>
                                    {notification.title}
                                </span>

                                <p>
                                    {notification.message}
                                </p>

                                <small>
                                    {formatTime(notification.created_at)}
                                </small>
                            </button>
                        ))}

                    </div>

                </div>
            )}

        </div>
    );
}

export default NotificationBell;
