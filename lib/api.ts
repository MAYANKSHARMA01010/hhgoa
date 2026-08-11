import axios from "axios";

/**
 * Returns the absolute base URL for the application depending on environment.
 * Works seamlessly locally (localhost:3000), on Vercel preview/production, and custom domains.
 */
export function getBaseUrl(): string {
  // Client side
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Explicit env variable (local or custom deployment)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL;
    return url.startsWith("http") ? url : `https://${url}`;
  }

  // Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local SSR
  return "http://localhost:3000";
}

/**
 * Pre-configured Axios instance for client and server API calls.
 */
export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
});

// Update baseURL dynamically on client execution
if (typeof window !== "undefined") {
  apiClient.defaults.baseURL = window.location.origin;
}

/**
 * Standard CORS headers for Next.js Route Handlers.
 * Ensures local dev and production domains can communicate cleanly.
 */
export function getCorsHeaders(origin?: string | null): Record<string, string> {
  const allowedOrigin = origin || "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };
}
