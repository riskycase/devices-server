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
  [channel: string]: string | undefined;
};

export type SocketMap = {
  [deviceId: string]: SocketDetails;
};
