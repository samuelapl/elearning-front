export type Role =
  | "course_owner"
  | "content_approver"
  | "training_admin"
  | "trainer"
  | "learner"
  | "system_admin";

export type Lang = "en" | "am";

export type UserStatus = "pending" | "active" | "rejected" | "suspended";

export type CourseStatus =
  | "draft"
  | "under_review"
  | "approved"
  | "rejected"
  | "archived";

export interface RoleInfo {
  key: Role;
  label: string;
  description: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  department: string;
  status: UserStatus;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMin: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  passMark: number;
  attemptsAllowed: number;
  questions: Question[];
}

export type AttachmentType = "video" | "pdf";

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  url: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  ownerId: string;
  trainerId: string | null;
  status: CourseStatus;
  published: boolean;
  createdAt: string;
  rejectionReason?: string;
  lastRejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  enrolledLearnerIds: string[];
  progress: Record<string, number>;
  modules: Module[];
  attachments?: Attachment[];
  quiz?: Quiz;
}

export interface SessionAttendee {
  userId: string;
  attended: boolean;
}

export interface LiveSession {
  id: string;
  courseId: string;
  title: string;
  date: string;
  time: string;
  durationMin: number;
  trainerId: string;
  meetingUrl?: string;
  trainerAttended?: boolean;
  attendees: SessionAttendee[];
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export type ActionResult = { ok: true } | { ok: false; message: string };

export type LoginResult =
  | { ok: true; role: Role }
  | { ok: false; message: string };
