import { api } from "../config/api.js";
import { normalizeSummary, normalizeUsage } from "../utils/normalizers.js";

export const analyticsService = {
  async getSummary() {
    const response = await api.get("/analytics/summary");
    return normalizeSummary(response.data);
  },

  async getUsage() {
    const response = await api.get("/analytics/usage");
    return normalizeUsage(response.data);
  },
};
