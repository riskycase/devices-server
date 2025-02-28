import { randomBytes } from "crypto";
import repo from "../devices/repo";
export default function connectionManager(socket) {
    const authToken = randomBytes(8).toString("hex");
    repo[socket.handshake.auth.deviceId] = {
        id: socket.handshake.auth.deviceId,
        authToken,
    };
    socket.emit("authToken", JSON.stringify({
        authToken,
    }));
    socket.onAny((channel, message, ..._dump) => {
        if (channel === "authToken")
            return;
        const messageJSON = JSON.parse(message);
        if (messageJSON.authToken !== repo[socket.handshake.auth.deviceId].authToken)
            return;
        repo[socket.handshake.auth.deviceId][channel] = JSON.stringify(messageJSON.body);
    });
}
