import { randomBytes } from "crypto";
import { Socket } from "socket.io";
import repo from "../devices/repo";

export default function connectionManager(socket: Socket) {
  const authToken = randomBytes(8).toString("hex");
  repo[socket.handshake.auth.deviceId] = {
    id: socket.handshake.auth.deviceId,
    authToken,
  };
  socket.emit(
    "authToken",
    JSON.stringify({
      authToken,
    })
  );
  console.log(repo);

  socket.onAny((channel: string, message: string, ..._dump: Array<string>) => {
    if (channel === "authToken") return;
    const messageJSON = JSON.parse(message);
    if (
      messageJSON.authToken !== repo[socket.handshake.auth.deviceId].authToken
    )
      return;
    repo[socket.handshake.auth.deviceId][channel] = messageJSON.body;
    console.log(repo);
  });
}
