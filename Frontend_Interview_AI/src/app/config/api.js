import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends/receives cookies — required for JWT cookie auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Only fire auth:expired for 401s on protected routes
// NOT on /get-me (initial check when logged out) or login/register
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;

    const isAuthCheckRoute =
      url.includes("/auth/get-me") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/verify-otp") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password");

    if (status === 401 && !isAuthCheckRoute) {
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  },
);