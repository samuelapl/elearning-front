import type { Role, User, UserStatus } from "@/types";

export interface MockAccount {
  role: Role;
  email: string;
  password: string;
}

export const MOCK_PASSWORD = "password";

export const MOCK_ACCOUNTS: MockAccount[] = [
  { role: "course_owner", email: "owner@gmail.com", password: MOCK_PASSWORD },
  { role: "content_approver", email: "approver@gmail.com", password: MOCK_PASSWORD },
  { role: "training_admin", email: "tadministrator@gmail.com", password: MOCK_PASSWORD },
  { role: "trainer", email: "trainer@gmail.com", password: MOCK_PASSWORD },
  { role: "learner", email: "learner@gmail.com", password: MOCK_PASSWORD },
  { role: "system_admin", email: "sadministrator@gmail.com", password: MOCK_PASSWORD },
];

/** Demo login emails map onto seed users (whose directory emails are MoR addresses). */
export const DEMO_EMAIL_TO_USER_ID: Record<string, string> = {
  "owner@gmail.com": "u1",
  "approver@gmail.com": "u2",
  "tadministrator@gmail.com": "u3",
  "trainer@gmail.com": "u4",
  "learner@gmail.com": "u5",
  "sadministrator@gmail.com": "u6",
};

export const LOGIN_STATUS_MESSAGE: Record<Exclude<UserStatus, "active">, string> = {
  pending: "Your account is pending administrator approval.",
  rejected: "Your account registration was rejected. Please contact the administrator.",
  suspended: "Your account has been suspended. Please contact the administrator.",
};

export const MIN_PASSWORD_LENGTH = 8;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function passwordIssues(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include at least one letter and one number.";
  }
  return null;
}

export function findUserForLogin(users: User[], email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  const demoUserId = DEMO_EMAIL_TO_USER_ID[normalized];
  if (demoUserId) {
    return users.find((user) => user.id === demoUserId);
  }
  return users.find((user) => user.email.toLowerCase() === normalized);
}
