/**
 * Central API client.
 * When VITE_USE_MOCK=true  → calls in-memory mock handlers (no network).
 * When VITE_USE_MOCK=false → calls the Spring Boot REST API at VITE_API_URL.
 */

import { mockRequest } from "~/mocks/handlers";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("yb_token");
}

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  body?: string;
  method?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, method = "GET" } = options;

  if (USE_MOCK) {
    return mockRequest<T>(
      method,
      path,
      body ? JSON.parse(body) : undefined,
      params
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }

  const token = getToken();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url.toString(), { method, headers, body });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw { message: error.message ?? "Request failed", status: res.status };
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string, params?: RequestOptions["params"]) =>
    request<T>(path, { method: "GET", params }),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
