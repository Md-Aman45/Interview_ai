import { api } from "../config/api.js";
import { normalizeReport } from "../utils/normalizers.js";

export const interviewService = {
  async generateReport(formData) {
    const response = await api.post("/interview/generate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      ...response.data,
      report: normalizeReport(response.data?.report),
    };
  },

  async getAllReports() {
    const response = await api.get("/interview/reports");
    const reports = Array.isArray(response.data?.reports) ? response.data.reports : [];
    return reports.map(normalizeReport);
  },

  async getReport(id) {
    const response = await api.get(`/interview/reports/${id}`);
    return normalizeReport(response.data?.report);
  },

  async deleteReport(id) {
    const response = await api.delete(`/interview/reports/${id}`);
    return response.data;
  },

  async generateResume(reportId) {
    const response = await api.post(`/interview/resume/${reportId}`, {}, {
      responseType: "blob",
    });

    return response.data;
  },
};
