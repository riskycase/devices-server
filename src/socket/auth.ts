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
