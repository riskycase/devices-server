import { Device, Session } from "@prisma/client";
import { db } from "../db";
import { randomBytes } from "crypto";
import { devices } from "../devices/repo";
import { ExtendedError, Server, Socket } from "socket.io";

async function findDevice(deviceId: string): Promise<Device> {
  return await db.device.findFirstOrThrow({ where: { id: deviceId } });
}

async function findSession(sessionToken: string): Promise<Session> {
  return await db.session.findFirstOrThrow({ where: { sessionToken } });
}

export function authenticateGenerator(server: Server) {
  return function authenticate(
    socket: Socket,
    next: (err?: ExtendedError) => void
  ) {
    const { deviceId, secret, sessionToken, userId } = socket.handshake.auth;
    if (!!deviceId && !!secret) {
      findDevice(deviceId).then((device) => {
        if (device?.secretKey == secret) {
          const authToken = randomBytes(8).toString("hex");
          devices[socket.handshake.auth.deviceId] = {
            id: socket.handshake.auth.deviceId,
            authToken,
            userId: device.userId,
            socket,
            lastUpdated: Date.now(),
            keepAlive: setInterval(
              (deviceId: string) => {
                if (devices[deviceId]?.lastUpdated < Date.now() - 30000) {
                  devices[deviceId].socket.disconnect();
                  const timeout = devices[deviceId].keepAlive;
                  clearInterval(timeout);
                  server.to(devices[deviceId].userId).emit(
                    "deviceDisconnect",
                    JSON.stringify({
                      deviceId: deviceId,
                    })
                  );
                  delete devices[deviceId];
                }
              },
              1000,
              socket.handshake.auth.deviceId
            ),
            channels: {},
          };
          socket.join(device.userId);
          next();
        } else next(new Error("UNAUTHORISED"));
      });
    } else if (!!sessionToken && !!userId) {
      findSession(sessionToken).then((session) => {
        if (session.userId == userId) {
          socket.join(userId);
          next();
        } else next(new Error("UNAUTHORISED"));
      });
    } else next(new Error("UNAUTHORISED"));
  };
}
