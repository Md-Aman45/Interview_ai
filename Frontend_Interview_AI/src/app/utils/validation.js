export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("Use at least 8 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Add one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Add one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Add one number.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUsername(username) {
  if (!username || username.trim().length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters." };
  }

  if (username.trim().length > 20) {
    return { isValid: false, error: "Username must be 20 characters or fewer." };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    return { isValid: false, error: "Only letters, numbers, and underscores are allowed." };
  }

  return { isValid: true };
}

export function validateFile(file, options = {}) {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ["application/pdf"] } = options;

  if (!file) {
    return { isValid: false, error: "Choose a file first." };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be under 5MB." };
  }

  if (allowedTypes.length && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Only PDF files are supported." };
  }

  return { isValid: true };
}
