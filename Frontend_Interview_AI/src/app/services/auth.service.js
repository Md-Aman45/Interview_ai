import { api } from "../config/api.js";
import { normalizeUser } from "../utils/normalizers.js";

export const authService = {
  async register(payload) {
    const response = await api.post("/auth/register", payload);

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return {
      ...response.data,
      user: normalizeUser(response.data),
    };
  },

  async login(payload) {
    const response = await api.post("/auth/login", payload);

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return {
      ...response.data,
      user: normalizeUser(response.data),
    };
  },

  async logout() {
    await api.get("/auth/logout");
    localStorage.removeItem("token");
  },

  async getCurrentUser() {
    const response = await api.get("/auth/get-me");
    return normalizeUser(response.data);
  },
};
