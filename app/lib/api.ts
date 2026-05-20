/**
 * Central API client.
 * When VITE_USE_MOCK=true  → calls in-memory mock handlers (no network).
 * When VITE_USE_MOCK=false → calls the Spring Boot REST API at VITE_API_URL.
 */

import { mockRequest } from "~/mocks/handlers";
import { clearSession, getToken, isTokenExpired } from "~/lib/auth";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

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

  const base = BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const url = new URL(`${base}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }

  const token = getToken();

  // Proactively catch expired tokens before they hit the backend as a 500
  if (token && isTokenExpired()) {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw { message: "Session expired. Please log in again.", status: 401, body: null };
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url.toString(), { method, headers, body });

  if (!res.ok) {
    const rawText = await res.text().catch(() => "");
    let errBody: Record<string, unknown> | null = null;
    try { errBody = JSON.parse(rawText); } catch { /* not JSON */ }
    console.error(`[API] ${method} ${path} → ${res.status}`, errBody ?? rawText);
    const message =
      errBody?.message ||
      errBody?.error ||
      (Array.isArray(errBody?.errors) ? (errBody.errors as { defaultMessage?: string }[]).map((e) => e.defaultMessage).join(", ") : null) ||
      rawText ||
      res.statusText ||
      `Error ${res.status}`;
    throw { message, status: res.status, body: errBody };
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
