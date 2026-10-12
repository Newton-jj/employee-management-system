import axios from "axios";
import { io } from "socket.io-client";

const API_URL =
"http://localhost:3000/api/notifications";

const SOCKET_URL =
"http://localhost:3000";

const getHeaders = () => ({
    headers: {
        Authorization:
        `Bearer ${localStorage.getItem("token")}`
    }
});

export const getNotifications = async () => {
    const response =
    await axios.get(
        API_URL,
        getHeaders()
    );

    return response.data.data;
};

export const getUnreadNotificationCount = async () => {
    const response =
    await axios.get(
        `${API_URL}/unread-count`,
        getHeaders()
    );

    return response.data.count;
};

export const markNotificationAsRead = async (id) => {
    const response =
    await axios.patch(
        `${API_URL}/${id}/read`,
        {},
        getHeaders()
    );

    return response.data.data;
};

export const markAllNotificationsAsRead = async () => {
    await axios.patch(
        `${API_URL}/read-all`,
        {},
        getHeaders()
    );
};

export const createNotificationSocket = () =>
    io(SOCKET_URL, {
        auth: {
            token: localStorage.getItem("token")
        }
    });
