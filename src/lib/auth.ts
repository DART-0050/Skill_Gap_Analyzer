import { User } from "./types";

// Simple JWT-like token for demo purposes
// In production, you'd use proper JWT implementation
export const createToken = (user: User): string => {
  return btoa(
    JSON.stringify({
      email: user.email,
      name: user.name,
      quiz_completed: user.quiz_completed,
    }),
  );
};

export const decodeToken = (
  token: string,
): { email: string; name: string; quiz_completed: boolean } | null => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

export const getStoredUser = (): User | null => {
  const token = localStorage.getItem("skillpath_token");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    email: decoded.email,
    name: decoded.name,
    password_hash: "",
    quiz_completed: decoded.quiz_completed,
    predicted_cluster: null,
    predicted_domain: null,
    predicted_role: null,
    known_skills: [],
    learned_skills: [],
  };
};

export const setStoredUser = (user: User): void => {
  const token = createToken(user);
  localStorage.setItem("skillpath_token", token);
};

export const clearStoredUser = (): void => {
  localStorage.removeItem("skillpath_token");
};

export const isAuthenticated = (): boolean => {
  return getStoredUser() !== null;
};
