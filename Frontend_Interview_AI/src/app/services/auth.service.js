// import { api } from "../config/api.js";
// import { normalizeUser } from "../utils/normalizers.js";

// export const authService = {
//   async register(payload) {
//     const response = await api.post("/auth/register", payload);

//     if (response.data?.token) {
//       localStorage.setItem("token", response.data.token);
//     }

//     return {
//       ...response.data,
//       user: normalizeUser(response.data),
//     };
//   },

//   async login(payload) {
//     const response = await api.post("/auth/login", payload);

//     if (response.data?.token) {
//       localStorage.setItem("token", response.data.token);
//     }

//     return {
//       ...response.data,
//       user: normalizeUser(response.data),
//     };
//   },

//   async logout() {
//     await api.get("/auth/logout");
//     localStorage.removeItem("token");
//   },

//   async getCurrentUser() {
//     const response = await api.get("/auth/get-me");
//     return normalizeUser(response.data);
//   },
// };










import { api } from "../config/api.js";
import { normalizeUser } from "../utils/normalizers.js";

export const authService = {
  async register(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },

  async verifyOtp(payload) {
    const response = await api.post("/auth/verify-otp", payload);
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return { ...response.data, user: normalizeUser(response.data) };
  },

  async login(payload) {
    const response = await api.post("/auth/login", payload);
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return { ...response.data, user: normalizeUser(response.data) };
  },

  async logout() {
    await api.get("/auth/logout");
    localStorage.removeItem("token");
  },

  async getCurrentUser() {
    const response = await api.get("/auth/get-me");
    return normalizeUser(response.data);
  },

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await api.post("/auth/reset-password", { token, password });
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.post("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  },
};