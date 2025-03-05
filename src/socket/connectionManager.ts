import { Server, Socket } from "socket.io";
import { devices } from "../devices/repo";
import { ReducedSocketMap } from "@/types";

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
      const initialUpdate: ReducedSocketMap = {};
      for (const device in devices) {
        if (devices[device].userId === userId) {
          initialUpdate[device] = {
            channels: JSON.parse(JSON.stringify(devices[device].channels)),
          };
        }
      }
      socket.emit("init", JSON.stringify(initialUpdate));
    }

    socket.onAny(
      (channel: string, message: string, ..._dump: Array<string>) => {
        if (socket.handshake.auth.deviceId) {
          const socketDetails = devices[socket.handshake.auth.deviceId];
          if (
            channel === "authToken" ||
            channel === "init" ||
            channel === "deviceDisconnect"
          )
            return;
          const messageJSON = JSON.parse(message);
          if (messageJSON.authToken !== socketDetails.authToken) return;
          if (channel.startsWith("delta.")) {
            socketDetails.channels[channel.replace("delta.", "")] =
              JSON.stringify({
                ...JSON.parse(
                  socketDetails.channels[channel.replace("delta.", "")] || "{}"
                ),
                ...JSON.parse(messageJSON.body),
              });
          } else {
            socketDetails.channels[channel] = messageJSON.body;
          }
          server.to(socketDetails.userId).emit(
            channel,
            JSON.stringify({
              body: messageJSON.body,
              deviceId: socket.handshake.auth.deviceId,
            })
          );
        } else {
          if (channel === "command") {
            const deviceId = message.split("=:=")[0];
            devices[deviceId].socket.emit("command", message);
            return;
          }
        }
      }
    );
  };
}
