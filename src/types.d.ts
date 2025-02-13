type ApiFailure<T> = {
  responseCode: "UNAUTHENTICATED" | "UNAUTHORISED" | "FORBIDDEN" | "DBERROR";
};

type ApiSuccess<T> = {
  responseCode: "SUCCESS";
  result: T;
};

type ApiResponse<T> = ApiFailure<T> | ApiSuccess<T>;

type EmptyApiResponse = {
  responseCode:
    | "SUCCESS"
    | "UNAUTHENTICATED"
    | "UNAUTHORISED"
    | "FORBIDDEN"
    | "DBERROR";
};

type SocketUpdateEvent = {
  message: any;
  deviceId: string;
  secret: string;
};
