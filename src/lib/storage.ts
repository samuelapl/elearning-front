import type { AuditLog, Course, Lang, LiveSession, User } from "@/types";

export const LMS_STORAGE_KEY = "eltms-demo-v1";

export interface PersistedLmsState {
  users: User[];
  courses: Course[];
  sessions: LiveSession[];
  auditLogs: AuditLog[];
  currentUserId: string | null;
  lang: Lang;
}

export function loadLmsState(): PersistedLmsState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LMS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedLmsState;
    if (!Array.isArray(parsed.users) || !Array.isArray(parsed.courses)) return null;
    if (!parsed.users[0] || typeof parsed.users[0].status !== "string") return null;
    if (!parsed.courses[0] || typeof parsed.courses[0].createdAt !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLmsState(state: PersistedLmsState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LMS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private-mode failures in the demo.
  }
}
