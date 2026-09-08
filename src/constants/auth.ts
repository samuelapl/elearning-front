import type { Role } from "@/types";

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

export function authenticate(email: string, password: string): Role | null {
  const account = MOCK_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!account || account.password !== password) return null;
  return account.role;
}