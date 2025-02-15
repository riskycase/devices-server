import { db } from "../db";
async function findDevice(deviceId) {
    return await db.device.findFirst({ where: { id: deviceId } });
}
export function authenticate(socket, next) {
    const { deviceId, secret } = socket.handshake.auth;
    findDevice(deviceId).then((device) => {
        if ((device === null || device === void 0 ? void 0 : device.secretKey) == secret)
            next();
        else
            next(new Error("UNAUTHORISED"));
    });
}
