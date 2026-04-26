const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const scaleScore = (value) => {
  const numeric = toNumber(value, 0);
  if (numeric <= 10) {
    return Math.round(numeric * 10);
  }
  return Math.round(numeric);
};

export function normalizeUser(payload) {
  if (!payload) {
    return null;
  }

  const source = payload?.user || payload?.data?.user || payload?.data || payload;

  const id = source?._id || source?.id;
  const email = source?.email;

  if (!id && !email) return null;

  return {
      _id: id || email,
      username: source?.username || source?.name || email?.split('@')[0] || 'User',
      email: email || '',
  };
}

export function normalizeUsage(payload) {
  const arrayUsage = Array.isArray(payload?.usage) ? payload.usage : null;

  if (arrayUsage) {
    const byType = Object.fromEntries(arrayUsage.map((entry) => [entry.type, entry]));
    const reports = byType.report || {};
    const resumes = byType.resume || {};
    const mocks = byType.mock || {};

    return {
      reports: {
        used: toNumber(reports.used, 0),
        limit: toNumber(reports.limit, 20),
        remaining: Math.max(0, toNumber(reports.limit, 20) - toNumber(reports.used, 0)),
      },
      resumes: {
        used: toNumber(resumes.used, 0),
        limit: toNumber(resumes.limit, 15),
        remaining: Math.max(0, toNumber(resumes.limit, 15) - toNumber(resumes.used, 0)),
      },
      mockInterviews: {
        used: toNumber(mocks.used, 0),
        limit: toNumber(mocks.limit, 10),
        remaining: Math.max(0, toNumber(mocks.limit, 10) - toNumber(mocks.used, 0)),
      },
      resetsAt: reports.resetsOn || resumes.resetsOn || mocks.resetsOn || null,
    };
  }

  const usage = payload?.usage || payload || {};
  return {
    reports: usage.reports || { used: 0, limit: 20, remaining: 20 },
    resumes: usage.resumes || { used: 0, limit: 15, remaining: 15 },
    mockInterviews: usage.mockInterviews || { used: 0, limit: 10, remaining: 10 },
    resetsAt: usage.resetsAt || null,
    username: usage.username || null,
  };
}

export function normalizeSummary(payload) {
  const data = payload?.data || payload || {};
  const weakTopics = Array.isArray(data.weakTopics) ? data.weakTopics : [];
  const scoreHistory = Array.isArray(data.scoreHistory) ? data.scoreHistory : [];

  if ("totalSessions" in data || "overallAverageScore" in data) {
    return {
      totalMockInterviews: toNumber(data.totalSessions, 0),
      averageScore: toNumber(data.overallAverageScore, 0),
      weakTopics: weakTopics.map((topic) => ({
        topic: topic.topic || topic.question || "Needs review",
        averageScore: toNumber(topic.averageScore, Math.max(0, 100 - toNumber(topic.count, 0) * 10)),
        count: toNumber(topic.count, 0),
      })),
      scoreHistory: scoreHistory.map((item, index) => ({
        name: item.name || item.date || `Session ${index + 1}`,
        score: toNumber(item.averageScore ?? item.score, 0),
        jobTitle: item.jobTitle || "Interview Session",
      })),
    };
  }

  return {
    totalMockInterviews: toNumber(data.totalMockInterviews, 0),
    averageScore: toNumber(data.averageScore, 0),
    weakTopics: weakTopics,
    scoreHistory: scoreHistory,
  };
}

export function normalizeReport(report) {
  if (!report) {
    return null;
  }

  const recommendation =
    typeof report.hiringRecommendation === "string"
      ? {
          decision: report.hiringRecommendation,
          confidence: toNumber(report.confidence, 0),
          reasoning: report.overallAnalysis || "",
        }
      : {
          decision: report.hiringRecommendation?.decision || "Consider",
          confidence: toNumber(
            report.hiringRecommendation?.confidence ?? report.confidence,
            0,
          ),
          reasoning: report.hiringRecommendation?.reasoning || report.overallAnalysis || "",
        };

  const breakdown = report.scoreBreakdown || report.matchScore || {};

  return {
    _id: report._id || report.id,
    jobRole: report.jobRole || report.title || "Target Role",
    createdAt: report.createdAt || new Date().toISOString(),
    resume: report.resume || "",
    selfDescription: report.selfDescription || "",
    jobDescription: report.jobDescription || "",
    averageScore: toNumber(report.averageScore, 0),
    matchScore: {
      overall: scaleScore(report.matchScore?.overall ?? report.matchScore ?? report.averageScore),
      technical: scaleScore(breakdown.technical),
      projects: scaleScore(breakdown.projects),
      problemSolving: scaleScore(breakdown.problemSolving),
      communication: scaleScore(breakdown.communication),
    },
    hiringRecommendation: recommendation,
    overallAnalysis: report.overallAnalysis || recommendation.reasoning || "",
    technicalQuestions: (report.technicalQuestions || []).map((item) => ({
      question: item.question,
      intention: item.intention,
      idealAnswer: item.idealAnswer || item.answer || "",
      feedback: item.feedback || "",
      score: toNumber(item.score, 0),
    })),
    behavioralQuestions: (report.behavioralQuestions || []).map((item) => ({
      question: item.question,
      intention: item.intention,
      idealAnswer: item.idealAnswer || item.answer || "",
      feedback: item.feedback || "",
      score: toNumber(item.score, 0),
    })),
    skillGaps: (report.skillGaps || []).map((item) => ({
      skill: item.skill,
      severity: item.severity || "medium",
      suggestion: item.suggestion || item.recommendation || "",
    })),
    preparationPlan: (report.preparationPlan || []).map((item, index) => ({
      day: item.day || index + 1,
      focus: item.focus,
      tasks: Array.isArray(item.tasks) ? item.tasks : [],
    })),
  };
}

export function normalizeSession(session) {
  if (!session) {
    return null;
  }

  return {
    _id: session._id || session.sessionId || session.id,
    sessionId: session.sessionId || session._id || session.id,
    jobTitle: session.jobTitle || session.jobRole || "Interview Session",
    averageScore: toNumber(session.averageScore, 0),
    totalQuestions: toNumber(session.totalQuestions, session.answers?.length || 0),
    startedAt: session.startedAt || new Date().toISOString(),
    createdAt: session.createdAt || session.startedAt || new Date().toISOString(),
    status: session.status || "ongoing",
    answers: Array.isArray(session.answers) ? session.answers : [],
  };
}
