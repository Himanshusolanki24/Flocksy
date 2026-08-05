import { siteConfig } from "@/config/site";
import { getAuthToken } from "@/lib/utils";

/** Normalized error thrown by the API client. */
export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status = 0, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** JSON body — serialized automatically. */
  body?: unknown;
  /** Raw multipart/form-data body (overrides `body`). */
  formData?: FormData;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Attach the bearer token. Defaults to true. */
  auth?: boolean;
  timeout?: number;
}

/** Typed, optimistic JSON fetcher with auth + timeout + error normalization. */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    formData,
    headers = {},
    signal,
    auth = true,
    timeout = 15_000,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  // Combine external + internal signal
  const abortFromCaller = signal;
  if (abortFromCaller) {
    abortFromCaller.addEventListener("abort", () => controller.abort());
  }

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (!formData) requestHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = getAuthToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  let payload: BodyInit | undefined;
  if (formData) payload = formData;
  else if (body !== undefined) payload = JSON.stringify(body);

  const url = `${siteConfig.apiUrl}${path}`;

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: payload,
      signal: controller.signal,
      // Prefer cached-revalidate for GET where possible; API layer controls caching.
      cache: method === "GET" ? "no-store" : undefined,
    });

    const text = await response.text();
    const data = text ? safeParse(text) : undefined;

    if (!response.ok) {
      const message = extractErrorMessage(data) ?? `Request failed (${response.status})`;
      throw new ApiError(message, response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out", 408);
    }
    // Network-level failure.
    if (error instanceof TypeError) {
      throw new ApiError(
        "Cannot reach Flocksy. Check your internet connection and try again.",
        0,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const anyData = data as Record<string, unknown>;
  if (typeof anyData.error === "string") return anyData.error;
  // Zod flattened error shape { fieldErrors: { email: [...] } }
  if (anyData.error && typeof anyData.error === "object") {
    const first = Object.values(anyData.error as Record<string, unknown>)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  }
  return null;
}

function parseErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export const http = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export const httpErrorMessage = parseErrorMessage;