import { auth } from "@/auth";
import { db } from "@/db";
import { randomBytes } from "crypto";
export async function createDevice() {
    const user = await auth();
    if (!user || !user.user) {
        return {
            responseCode: "UNAUTHENTICATED",
        };
    }
    const secret = randomBytes(16).toString("hex");
    try {
        const [currentUser, existingDevices] = await Promise.all([
            db.user.findFirstOrThrow({ where: { id: user.user.id } }),
            db.device.findMany({ where: { userId: user.user.id } }),
        ]);
        if (existingDevices.length >= currentUser.deviceLimit) {
            return {
                responseCode: "FORBIDDEN",
            };
        }
        const device = await db.device.create({
            data: {
                secretKey: secret,
                userId: user.user.id,
            },
        });
        return {
            responseCode: "SUCCESS",
            result: device,
        };
    }
    catch (e) {
        console.trace(e);
        return {
            responseCode: "DBERROR",
        };
    }
}
export async function getDevice(deviceId, secret) {
    try {
        const device = await db.device.findFirst({ where: { id: deviceId } });
        if ((device === null || device === void 0 ? void 0 : device.secretKey) == secret) {
            return {
                responseCode: "SUCCESS",
                result: device,
            };
        }
        else {
            return {
                responseCode: "UNAUTHORISED",
            };
        }
    }
    catch (e) {
        console.trace(e);
        return {
            responseCode: "DBERROR",
        };
    }
}
export async function deleteDevice(device) {
    const user = await auth();
    if (!user || !user.user) {
        return {
            responseCode: "UNAUTHENTICATED",
        };
    }
    try {
        const deviceToDelete = await db.device.findFirst({
            where: { id: device.id },
        });
        if ((deviceToDelete === null || deviceToDelete === void 0 ? void 0 : deviceToDelete.userId) == user.user.id) {
            await db.device.delete({ where: { id: device.id } });
            return {
                responseCode: "SUCCESS",
            };
        }
        else {
            return {
                responseCode: "UNAUTHORISED",
            };
        }
    }
    catch (e) {
        console.trace(e);
        return {
            responseCode: "DBERROR",
        };
    }
}
