import { Socket } from "socket.io";

export type ApiFailure = {
  responseCode: "UNAUTHENTICATED" | "UNAUTHORISED" | "FORBIDDEN" | "DBERROR";
};

export type ApiSuccess<T> = {
  responseCode: "SUCCESS";
  result: T;
};

export type ApiResponse<T> = ApiFailure | ApiSuccess<T>;

export type EmptyApiResponse = {
  responseCode:
    | "SUCCESS"
    | "UNAUTHENTICATED"
    | "UNAUTHORISED"
    | "FORBIDDEN"
    | "DBERROR";
};

export type SocketDetails = {
  id: string;
  authToken: string;
  userId: string;
  socket: Socket
  keepAlive: NodeJS.Timeout;
  lastUpdated: number;
  channels: { [channel: string]: string | undefined };
};

export type ReducedSocketMap = {
  [deviceId: string]: {
    channels: { [channel: string]: string | undefined };
  };
};

export type SendCommandFunction = (commandString: string) => void

export type SocketMap = {
  [deviceId: string]: SocketDetails;
};
