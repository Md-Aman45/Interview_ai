import { api } from "../config/api.js";
import { normalizeSession } from "../utils/normalizers.js";



// Add these two helpers at the top of mock.service.js
const SESSION_KEY = 'active_mock_session';

export function saveActiveSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getActiveSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
        return null;
    }
}

export function clearActiveSession() {
    localStorage.removeItem(SESSION_KEY);
}





export const mockService = {
  async startSession(payload) {
    const response = await api.post("/mock/start", payload);
    return {
      sessionId: response.data?.sessionId,
      message: response.data?.message || "",
      firstQuestion: response.data?.firstQuestion || "",
      startedAt: response.data?.startedAt || new Date().toISOString(),
      timeLimit: response.data?.timeLimit || 30,
      usage: response.data?.usage || null,
    };
  },

  async submitAnswer(sessionId, payload) {
    const response = await api.post("/mock/answer", {
      sessionId,
      question: payload.question,
      userAnswer: payload.answer,
    });
    return response.data;
  },

  async endSession(sessionId) {
    const response = await api.post("/mock/end", { sessionId });
    return response.data;
  },

  async getAllSessions() {
    const response = await api.get("/mock/sessions");
    const sessions = Array.isArray(response.data?.sessions) ? response.data.sessions : [];
    return sessions.map(normalizeSession);
  },
};
