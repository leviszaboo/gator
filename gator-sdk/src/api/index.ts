export const enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const enum Endpoints {
  LOGIN = "api/v1/users/login",
  SIGNUP = "api/v1/users/sign-up",
  DELETE_USER = "api/v1/users/:userId/delete",
  UPDATE_EMAIL = "api/v1/users/:userId/update-email",
  UPDATE_PASSWORD = "api/v1/users/:userId/update-password",
  SEND_VERIFICATION_EMAIL = "api/v1/users/:userId/send-verification-email",
  REISSUE_TOKEN = "api/v1/tokens/reissue-token",
  INVALIDATE_TOKEN = "api/v1/tokens/INVALIDATE-token",
}

export const enum HttpHeader {
  CONTENT_TYPE = "Content-Type",
  API_KEY = "X-Gator-Api-Key",
  APP_ID = "X-Gator-App-Id",
}
