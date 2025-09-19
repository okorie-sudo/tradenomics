// src/utils/validators.ts

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const passwordStrength = (password: string) => {
  if (password.length < 6) return { score: 0, label: "Too short" };
  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++; // special char
  if (password.length >= 12) score++;

  const levels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  return { score, label: levels[Math.min(score, levels.length - 1)] };
};

export const isStrongPassword = (password: string) => {
  return passwordStrength(password).score >= 3; // e.g. Good or better
};
