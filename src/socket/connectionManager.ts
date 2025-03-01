import { Server, Socket } from "socket.io";
import { devices } from "../devices/repo";
import { SocketMap } from "@/types";

export default function connectionManager(server: Server) {
  return function connectionManager(socket: Socket) {
    if (socket.handshake.auth.deviceId) {
      const authToken = devices[socket.handshake.auth.deviceId].authToken;
      socket.emit(
        "authToken",
        JSON.stringify({
          authToken,
        })
      );
    } else {
      const userId = socket.handshake.auth.userId;
      const initialUpdate: SocketMap = {};
      for (const device in devices) {
        if (devices[device].userId === userId) {
          initialUpdate[device] = JSON.parse(JSON.stringify(devices[device]));
          initialUpdate[device].authToken = "redacted";
        }
      }
      socket.emit("init", JSON.stringify(initialUpdate));
    }

    socket.onAny(
      (channel: string, message: string, ..._dump: Array<string>) => {
        if (socket.handshake.auth.deviceId) {
          const socketDetails = devices[socket.handshake.auth.deviceId];
          if (channel === "authToken" || channel === "init") return;
          const messageJSON = JSON.parse(message);
          if (messageJSON.authToken !== socketDetails.authToken) return;
          if (channel.startsWith("delta.")) {
            socketDetails[channel.replace("delta.", "")] = JSON.stringify({
              ...JSON.parse(
                socketDetails[channel.replace("delta.", "")] || "{}"
              ),
              ...JSON.parse(messageJSON.body),
            });
          } else {
            socketDetails[channel] = messageJSON.body;
          }
          server.to(socketDetails.userId).emit(
            channel,
            JSON.stringify({
              body: messageJSON.body,
              deviceId: socket.handshake.auth.deviceId,
            })
          );
        }
      }
    );
  };
}
