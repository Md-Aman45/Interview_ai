export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date) {
  const target = new Date(date).getTime();
  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - target) / 1000));

  if (diffInSeconds < 60) {
    return "Just now";
  }

  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  }

  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  }

  if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  return formatDate(date);
}

export function formatTime(ms) {
  const safeMs = Math.max(0, ms);
  const minutes = Math.floor(safeMs / 60000);
  const seconds = Math.floor((safeMs % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getRecommendationBadge(decision) {
  const mapping = {
    "Strong Hire": { variant: "success", text: "Strong Hire" },
    Hire: { variant: "info", text: "Hire" },
    Consider: { variant: "warning", text: "Consider" },
    Reject: { variant: "danger", text: "Reject" },
  };

  return mapping[decision] || mapping.Consider;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
