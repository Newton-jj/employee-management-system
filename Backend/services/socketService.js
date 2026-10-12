const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication required"));
        }

        try {
            socket.user = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

const emitNotification = (notification) => {
    if (!io) {
        return;
    }

    io.emit("notification:new", notification);
};

module.exports = {
    initSocket,
    emitNotification
};
