import axios from "axios";

/**
 * Returns the configured port (default 3000 for Next.js full-stack frontend & backend).
 */
export function getAppPort(): string {
  return process.env.PORT || process.env.NEXT_PUBLIC_PORT || "3000";
}

/**
 * Returns the absolute base URL for the application depending on environment.
 * Supports NEXT_PUBLIC_APP_URL (local), NEXT_HOSTED_APP_URL (hosted production),
 * VERCEL_URL, and window.location.origin.
 */
export function getBaseUrl(): string {
  // Client side: use browser location origin dynamically
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Explicit Hosted Production URL env variable
  if (process.env.NEXT_HOSTED_APP_URL && process.env.NODE_ENV === "production") {
    const hosted = process.env.NEXT_HOSTED_APP_URL;
    return hosted.startsWith("http") ? hosted : `https://${hosted}`;
  }

  // Explicit Local/Public App URL env variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL;
    return url.startsWith("http") ? url : `https://${url}`;
  }

  // Vercel deployment URL fallback
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local SSR / Server
  const port = getAppPort();
  return `http://localhost:${port}`;
}

/**
 * Pre-configured Axios instance for client and server API calls.
 */
export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
});

// Sync baseURL dynamically on client execution
if (typeof window !== "undefined") {
  apiClient.defaults.baseURL = window.location.origin;
}

/**
 * Dynamic CORS headers helper for Next.js Route Handlers.
 * Allows local dev origins, Vercel deployments, and custom hosted domains.
 */
export function getCorsHeaders(origin?: string | null): Record<string, string> {
  const localUrl = process.env.NEXT_PUBLIC_APP_URL;
  const hostedUrl = process.env.NEXT_HOSTED_APP_URL;
  const allowedOrigin = origin || hostedUrl || localUrl || "*";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };
}
