import { Device } from "@prisma/client";
import { db } from "../db";

async function findDevice(deviceId: string): Promise<Device | null> {
    return await db.device.findFirst({where: {id: deviceId}})
}

export function authenticate(socket: any, next: any) {
  const { deviceId, secret } = socket.handshake.auth;
  findDevice(deviceId).then((device) => {
    if (device?.secretKey == secret) next();
    else next(new Error("UNAUTHORISED"));
  });
}
