import { db } from "../db";
import { randomBytes } from "crypto";
import { devices } from "../devices/repo";
async function findDevice(deviceId) {
    return await db.device.findFirstOrThrow({ where: { id: deviceId } });
}
async function findSession(sessionToken) {
    return await db.session.findFirstOrThrow({ where: { sessionToken } });
}
export function authenticate(socket, next) {
    const { deviceId, secret, sessionToken, userId } = socket.handshake.auth;
    if (!!deviceId && !!secret) {
        findDevice(deviceId).then((device) => {
            if ((device === null || device === void 0 ? void 0 : device.secretKey) == secret) {
                const authToken = randomBytes(8).toString("hex");
                devices[socket.handshake.auth.deviceId] = {
                    id: socket.handshake.auth.deviceId,
                    authToken,
                    userId: device.userId,
                };
                socket.join(device.userId);
                next();
            }
            else
                next(new Error("UNAUTHORISED"));
        });
    }
    else if (!!sessionToken && !!userId) {
        findSession(sessionToken).then((session) => {
            if (session.userId == userId) {
                socket.join(userId);
                next();
            }
            else
                next(new Error("UNAUTHORISED"));
        });
    }
    else
        next(new Error("UNAUTHORISED"));
}
