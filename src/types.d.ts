export type ApiFailure<T> = {
  responseCode: "UNAUTHENTICATED" | "UNAUTHORISED" | "FORBIDDEN" | "DBERROR";
};

export type ApiSuccess<T> = {
  responseCode: "SUCCESS";
  result: T;
};

export type ApiResponse<T> = ApiFailure<T> | ApiSuccess<T>;

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
  [channel: string]: any;
};

export type SocketMap = {
  [deviceId: string]: SocketDetails;
};
