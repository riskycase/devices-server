import { getDevice } from "@/actions";
export function authenticate(socket, next) {
    const { deviceId, secret } = socket.handshake.auth;
    getDevice(deviceId, secret).then((res) => {
        if (res.responseCode == "SUCCESS")
            next();
        else
            next(new Error("UNAUTHORISED"));
    });
}
