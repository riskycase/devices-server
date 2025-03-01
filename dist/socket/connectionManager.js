import { devices } from "../devices/repo";
export default function connectionManager(server) {
    return function connectionManager(socket) {
        if (socket.handshake.auth.deviceId) {
            const authToken = devices[socket.handshake.auth.deviceId].authToken;
            socket.emit("authToken", JSON.stringify({
                authToken,
            }));
        }
        else {
            const userId = socket.handshake.auth.userId;
            const initialUpdate = {};
            for (const device in devices) {
                if (devices[device].userId === userId) {
                    initialUpdate[device] = JSON.parse(JSON.stringify(devices[device]));
                    initialUpdate[device].authToken = "redacted";
                }
            }
            socket.emit("init", JSON.stringify(initialUpdate));
        }
        socket.onAny((channel, message, ..._dump) => {
            if (socket.handshake.auth.deviceId) {
                const socketDetails = devices[socket.handshake.auth.deviceId];
                if (channel === "authToken" || channel === "init")
                    return;
                const messageJSON = JSON.parse(message);
                if (messageJSON.authToken !== socketDetails.authToken)
                    return;
                if (channel.startsWith("delta.")) {
                    socketDetails[channel.replace("delta.", "")] = JSON.stringify({
                        ...JSON.parse(socketDetails[channel.replace("delta.", "")] || "{}"),
                        ...JSON.parse(messageJSON.body),
                    });
                }
                else {
                    socketDetails[channel] = messageJSON.body;
                }
                server.to(socketDetails.userId).emit(channel, JSON.stringify({
                    body: messageJSON.body,
                    deviceId: socket.handshake.auth.deviceId,
                }));
            }
        });
    };
}
