import { replaceParams } from "./utils";
import { Auth } from "src/core/auth";

export const enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const enum Endpoint {
  LOGIN = "api/v1/users/login",
  SIGNUP = "api/v1/users/sign-up",
  DELETE_USER = "api/v1/users/:userId/delete",
  UPDATE_EMAIL = "api/v1/users/:userId/update-email",
  UPDATE_PASSWORD = "api/v1/users/:userId/update-password",
  SEND_VERIFICATION_EMAIL = "api/v1/users/:userId/send-verification-email",
  REISSUE_TOKEN = "api/v1/tokens/reissue-token",
  INVALIDATE_TOKEN = "api/v1/tokens/invalidate-token",
}

export const enum HttpHeader {
  CONTENT_TYPE = "Content-Type",
  API_KEY = "X-Gator-Api-Key",
  APP_ID = "X-Gator-App-Id",
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  auth: Auth;
  endpoint: Endpoint;
  request_body?: Record<string, string | number>;
  params?: Record<string, string | number>;
  method?: HttpMethod;
}

class GatorResponseError extends Error {
  statusCode: number;
  statusText: string;
  error: Record<string, any>;
  constructor(
    statusCode: number,
    statusText: string,
    error: Record<string, any>,
  ) {
    super();
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.error = error;
  }
}

export async function request({
  auth,
  endpoint,
  request_body = {},
  params = {},
  method = HttpMethod.GET,
  headers = {},
  ...options
}: RequestOptions): Promise<Response | void> {
  const { gatorAppId, gatorAuthApiKey, gatorAuthApiUrl } = auth._config;
  const url = new URL(gatorAuthApiUrl + replaceParams(endpoint, params));
  const includeBody =
    (method === HttpMethod.POST || method === HttpMethod.PUT) && !!request_body;

  const requestHeaders = {
    [HttpHeader.API_KEY]: gatorAuthApiKey,
    [HttpHeader.APP_ID]: gatorAppId,
    [HttpHeader.CONTENT_TYPE]: "application/json",
    ...(includeBody && { [HttpHeader.CONTENT_TYPE]: "application/json" }),
    ...headers,
  };

  const response = await fetch(url.toString(), {
    method,
    headers: requestHeaders,
    body: includeBody ? JSON.stringify(request_body) : undefined,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new GatorResponseError(response.status, response.statusText, error);
  }

  return response;
}
