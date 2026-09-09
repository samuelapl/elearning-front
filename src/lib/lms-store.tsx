"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_EMAIL_TO_USER_ID,
  findUserForLogin,
  isValidEmail,
  LOGIN_STATUS_MESSAGE,
  MOCK_ACCOUNTS,
  passwordIssues,
} from "@/constants/auth";
import {
  DEMO_USER_BY_ROLE,
  INITIAL_AUDIT_LOGS,
  INITIAL_COURSES,
  INITIAL_SESSIONS,
  INITIAL_USERS,
} from "@/data/mock";
import { loadLmsState, saveLmsState } from "@/lib/storage";
import type {
  ActionResult,
  AuditLog,
  Course,
  Lang,
  LiveSession,
  LoginResult,
  Quiz,
  Role,
  User,
  UserStatus,
} from "@/types";

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  department: string;
}

interface LmsContextValue {
  ready: boolean;
  courses: Course[];
  users: User[];
  sessions: LiveSession[];
  auditLogs: AuditLog[];
  lang: Lang;
  currentUser: User | null;
  setLang: (lang: Lang) => void;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  register: (input: RegisterInput) => ActionResult;
  approveUser: (userId: string) => ActionResult;
  rejectUser: (userId: string) => ActionResult;
  setUserStatus: (userId: string, status: UserStatus) => ActionResult;
  courseById: (courseId: string) => Course | undefined;
  userName: (userId: string) => string;
  createCourse: (input: {
    code: string;
    title: string;
    category: string;
    description: string;
  }) => ActionResult;
  updateCourse: (
    courseId: string,
    input: { title: string; category: string; description: string },
  ) => ActionResult;
  submitForApproval: (courseId: string) => ActionResult;
  approveCourse: (courseId: string) => ActionResult;
  rejectCourse: (courseId: string, reason: string) => ActionResult;
  publishCourse: (courseId: string) => ActionResult;
  enrollLearners: (courseId: string, learnerIds: string[]) => ActionResult;
  enrollSelf: (courseId: string) => ActionResult;
  updateQuiz: (courseId: string, quiz: Quiz) => void;
  scheduleSession: (input: {
    courseId: string;
    title: string;
    date: string;
    time: string;
    durationMin: number;
  }) => void;
  toggleAttendance: (sessionId: string, userId: string) => void;
  advanceProgress: (courseId: string, learnerId: string, amount: number) => void;
  changeUserRole: (userId: string, role: Role) => ActionResult;
}

const LmsContext = createContext<LmsContextValue | null>(null);

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}

function stamp(): string {
  const now = new Date();
  return `${todayIso()} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
}

export function LmsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [sessions, setSessions] = useState<LiveSession[]>(INITIAL_SESSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [lang, setLang] = useState<Lang>("en");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadLmsState();
    if (saved) {
      setUsers(saved.users);
      setCourses(saved.courses);
      setSessions(saved.sessions);
      setAuditLogs(saved.auditLogs);
      setCurrentUserId(saved.currentUserId);
      setLang(saved.lang ?? "en");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveLmsState({ users, courses, sessions, auditLogs, currentUserId, lang });
  }, [ready, users, courses, sessions, auditLogs, currentUserId, lang]);

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) ?? null,
    [users, currentUserId],
  );

  const actorName = useCallback(
    (fallbackRole: Role) => {
      if (currentUser) return currentUser.name;
      const id = DEMO_USER_BY_ROLE[fallbackRole];
      return users.find((user) => user.id === id)?.name ?? "Demo User";
    },
    [currentUser, users],
  );

  const addAudit = useCallback((actor: string, action: string, target: string) => {
    setAuditLogs((prev) => [
      { id: `al${Date.now()}`, actor, action, target, timestamp: stamp() },
      ...prev,
    ]);
  }, []);

  const userIdLabel = useCallback(
    (userId: string) => users.find((user) => user.id === userId)?.name ?? "Unknown",
    [users],
  );

  const hasRole = useCallback(
    (allowed: Role[]) => Boolean(currentUser && allowed.includes(currentUser.role)),
    [currentUser],
  );

  const login = useCallback(
    (email: string, password: string): LoginResult => {
      const user = findUserForLogin(users, email);
      const demo = MOCK_ACCOUNTS.find(
        (account) => account.email.toLowerCase() === email.trim().toLowerCase(),
      );
      const expectedPassword = user?.password ?? demo?.password;
      if (!user || !expectedPassword || expectedPassword !== password) {
        return { ok: false, message: "Invalid email or password." };
      }
      if (user.status !== "active") {
        return { ok: false, message: LOGIN_STATUS_MESSAGE[user.status] };
      }
      setCurrentUserId(user.id);
      return { ok: true, role: user.role };
    },
    [users],
  );

  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, []);

  const register = useCallback(
    (input: RegisterInput): ActionResult => {
      const firstName = input.firstName.trim();
      const lastName = input.lastName.trim();
      const email = input.email.trim().toLowerCase();
      const phone = input.phone.trim();
      const department = input.department.trim();

      if (!firstName || !lastName || !email || !phone || !input.password || !department) {
        return { ok: false, message: "All fields are required." };
      }
      if (!isValidEmail(email)) {
        return { ok: false, message: "Please enter a valid email address." };
      }
      const pwdError = passwordIssues(input.password);
      if (pwdError) return { ok: false, message: pwdError };
      if (input.password !== input.confirmPassword) {
        return { ok: false, message: "Confirm password must match." };
      }

      const emailTaken =
        users.some((user) => user.email.toLowerCase() === email) ||
        Boolean(DEMO_EMAIL_TO_USER_ID[email]);
      if (emailTaken) {
        return { ok: false, message: "An account with this email already exists." };
      }

      const newUser: User = {
        id: `u${Date.now()}`,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        password: input.password,
        role: "learner",
        department,
        status: "pending",
        createdAt: todayIso(),
      };
      setUsers((prev) => [...prev, newUser]);
      addAudit("Public registration", "submitted registration", newUser.email);
      return { ok: true };
    },
    [addAudit, users],
  );

  const approveUser = useCallback(
    (userId: string): ActionResult => {
      if (!hasRole(["system_admin"])) {
        return { ok: false, message: "Only administrators can approve registrations." };
      }
      const user = users.find((item) => item.id === userId);
      if (!user) return { ok: false, message: "User not found." };
      setUsers((prev) =>
        prev.map((item) => (item.id === userId ? { ...item, status: "active" } : item)),
      );
      addAudit(actorName("system_admin"), "approved registration", user.email);
      return { ok: true };
    },
    [actorName, addAudit, hasRole, users],
  );

  const rejectUser = useCallback(
    (userId: string): ActionResult => {
      if (!hasRole(["system_admin"])) {
        return { ok: false, message: "Only administrators can reject registrations." };
      }
      const user = users.find((item) => item.id === userId);
      if (!user) return { ok: false, message: "User not found." };
      setUsers((prev) =>
        prev.map((item) => (item.id === userId ? { ...item, status: "rejected" } : item)),
      );
      addAudit(actorName("system_admin"), "rejected registration", user.email);
      return { ok: true };
    },
    [actorName, addAudit, hasRole, users],
  );

  const setUserStatus = useCallback(
    (userId: string, status: UserStatus): ActionResult => {
      if (!hasRole(["system_admin"])) {
        return { ok: false, message: "Only administrators can change account status." };
      }
      setUsers((prev) =>
        prev.map((item) => (item.id === userId ? { ...item, status } : item)),
      );
      addAudit(actorName("system_admin"), `set status to ${status}`, userId);
      return { ok: true };
    },
    [actorName, addAudit, hasRole],
  );

  const createCourse: LmsContextValue["createCourse"] = useCallback(
    (input) => {
      if (!hasRole(["course_owner"])) {
        return { ok: false, message: "Only course owners can create courses." };
      }
      const ownerId = currentUser?.id ?? DEMO_USER_BY_ROLE.course_owner;
      const newCourse: Course = {
        id: `c${Date.now()}`,
        code: input.code || "TBD-000",
        title: input.title,
        category: input.category,
        description: input.description,
        ownerId,
        trainerId: null,
        status: "draft",
        published: false,
        createdAt: todayIso(),
        enrolledLearnerIds: [],
        progress: {},
        modules: [
          {
            id: `m-${Date.now()}-1`,
            title: "Module 1: Introduction",
            lessons: [
              { id: `l-${Date.now()}-1`, title: "Welcome and course overview", durationMin: 15 },
              { id: `l-${Date.now()}-2`, title: "Key concepts and definitions", durationMin: 20 },
            ],
          },
        ],
      };
      setCourses((prev) => [...prev, newCourse]);
      addAudit(actorName("course_owner"), "created course", newCourse.title);
      return { ok: true };
    },
    [actorName, addAudit, currentUser?.id, hasRole],
  );

  const updateCourse = useCallback(
    (
      courseId: string,
      input: { title: string; category: string; description: string },
    ): ActionResult => {
      const course = courses.find((item) => item.id === courseId);
      if (!course) return { ok: false, message: "Course not found." };
      const isOwner =
        hasRole(["course_owner"]) &&
        (currentUser?.id === course.ownerId || currentUser?.role === "course_owner");
      if (!isOwner) {
        return { ok: false, message: "You can only edit your own courses." };
      }
      if (course.status !== "draft" && course.status !== "rejected") {
        return { ok: false, message: "Only draft or rejected courses can be edited." };
      }
      setCourses((prev) =>
        prev.map((item) =>
          item.id === courseId
            ? {
                ...item,
                title: input.title,
                category: input.category,
                description: input.description,
              }
            : item,
        ),
      );
      addAudit(actorName("course_owner"), "updated course", input.title);
      return { ok: true };
    },
    [actorName, addAudit, courses, currentUser, hasRole],
  );

  const submitForApproval = useCallback(
    (courseId: string): ActionResult => {
      const course = courses.find((item) => item.id === courseId);
      if (!course) return { ok: false, message: "Course not found." };
      if (!hasRole(["course_owner"])) {
        return { ok: false, message: "Only course owners can submit courses." };
      }
      if (course.status !== "draft" && course.status !== "rejected") {
        return { ok: false, message: "Only draft or rejected courses can be submitted." };
      }
      setCourses((prev) =>
        prev.map((item) =>
          item.id === courseId
            ? {
                ...item,
                status: "under_review",
                lastRejectionReason: item.rejectionReason ?? item.lastRejectionReason,
              }
            : item,
        ),
      );
      addAudit(actorName("course_owner"), "submitted course for approval", course.title);
      return { ok: true };
    },
    [actorName, addAudit, courses, hasRole],
  );

  const approveCourse = useCallback(
    (courseId: string): ActionResult => {
      if (!hasRole(["content_approver", "system_admin"])) {
        return { ok: false, message: "You are not allowed to approve courses." };
      }
      const course = courses.find((item) => item.id === courseId);
      if (!course) return { ok: false, message: "Course not found." };
      setCourses((prev) =>
        prev.map((item) =>
          item.id === courseId
            ? { ...item, status: "approved", published: true }
            : item,
        ),
      );
      addAudit(actorName("content_approver"), "approved and published course", course.title);
      return { ok: true };
    },
    [actorName, addAudit, courses, hasRole],
  );

  const rejectCourse = useCallback(
    (courseId: string, reason: string): ActionResult => {
      if (!hasRole(["content_approver", "system_admin"])) {
        return { ok: false, message: "You are not allowed to reject courses." };
      }
      const trimmed = reason.trim();
      if (!trimmed) {
        return { ok: false, message: "A rejection reason is required." };
      }
      const course = courses.find((item) => item.id === courseId);
      if (!course) return { ok: false, message: "Course not found." };
      setCourses((prev) =>
        prev.map((item) =>
          item.id === courseId
            ? {
                ...item,
                status: "rejected",
                published: false,
                lastRejectionReason: item.rejectionReason ?? item.lastRejectionReason,
                rejectionReason: trimmed,
                rejectedBy: actorName("content_approver"),
                rejectedAt: stamp(),
              }
            : item,
        ),
      );
      addAudit(actorName("content_approver"), "rejected course", `${course.title}: ${trimmed}`);
      return { ok: true };
    },
    [actorName, addAudit, courses, hasRole],
  );

  const publishCourse = useCallback(
    (courseId: string): ActionResult => {
      if (!hasRole(["training_admin", "system_admin"])) {
        return { ok: false, message: "Only training administrators can publish courses." };
      }
      const course = courses.find((item) => item.id === courseId);
      setCourses((prev) =>
        prev.map((item) => (item.id === courseId ? { ...item, published: true } : item)),
      );
      addAudit(actorName("training_admin"), "published course", course?.title ?? courseId);
      return { ok: true };
    },
    [actorName, addAudit, courses, hasRole],
  );

  const enrollLearners = useCallback(
    (courseId: string, learnerIds: string[]): ActionResult => {
      if (!hasRole(["training_admin", "system_admin"])) {
        return { ok: false, message: "Only training administrators can enroll learners." };
      }
      setCourses((prev) =>
        prev.map((course) => {
          if (course.id !== courseId) return course;
          const added = learnerIds.filter((id) => !course.enrolledLearnerIds.includes(id));
          const progress = { ...course.progress };
          added.forEach((id) => {
            progress[id] = 0;
          });
          return {
            ...course,
            enrolledLearnerIds: [...course.enrolledLearnerIds, ...added],
            progress,
          };
        }),
      );
      addAudit(
        actorName("training_admin"),
        `enrolled ${learnerIds.length} learner(s)`,
        courses.find((course) => course.id === courseId)?.title ?? courseId,
      );
      return { ok: true };
    },
    [actorName, addAudit, courses, hasRole],
  );

  const enrollSelf = useCallback(
    (courseId: string): ActionResult => {
      if (!hasRole(["learner"]) || !currentUser) {
        return { ok: false, message: "Only learners can self-enroll." };
      }
      const course = courses.find((item) => item.id === courseId);
      if (!course?.published || course.status !== "approved") {
        return { ok: false, message: "This course is not available for enrollment." };
      }
      setCourses((prev) =>
        prev.map((item) => {
          if (item.id !== courseId) return item;
          if (item.enrolledLearnerIds.includes(currentUser.id)) return item;
          return {
            ...item,
            enrolledLearnerIds: [...item.enrolledLearnerIds, currentUser.id],
            progress: { ...item.progress, [currentUser.id]: 0 },
          };
        }),
      );
      addAudit(currentUser.name, "enrolled in course", course.title);
      return { ok: true };
    },
    [addAudit, courses, currentUser, hasRole],
  );

  const updateQuiz = useCallback(
    (courseId: string, quiz: Quiz) => {
      setCourses((prev) =>
        prev.map((course) => (course.id === courseId ? { ...course, quiz } : course)),
      );
      addAudit(
        actorName("trainer"),
        quiz.questions.length > 0 ? "updated quiz" : "created quiz",
        quiz.title,
      );
    },
    [actorName, addAudit],
  );

  const scheduleSession = useCallback(
    (input: {
      courseId: string;
      title: string;
      date: string;
      time: string;
      durationMin: number;
    }) => {
      const course = courses.find((c) => c.id === input.courseId);
      setSessions((prev) => [
        ...prev,
        {
          id: `s${Date.now()}`,
          courseId: input.courseId,
          title: input.title,
          date: input.date,
          time: input.time,
          durationMin: input.durationMin,
          trainerId: currentUser?.id ?? DEMO_USER_BY_ROLE.trainer,
          attendees: (course?.enrolledLearnerIds ?? []).map((userId) => ({
            userId,
            attended: false,
          })),
        },
      ]);
      addAudit(actorName("trainer"), "scheduled live session", input.title);
    },
    [actorName, addAudit, courses, currentUser?.id],
  );

  const toggleAttendance = useCallback((sessionId: string, userId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              attendees: session.attendees.map((attendee) =>
                attendee.userId === userId
                  ? { ...attendee, attended: !attendee.attended }
                  : attendee,
              ),
            }
          : session,
      ),
    );
  }, []);

  const advanceProgress = useCallback((courseId: string, learnerId: string, amount: number) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id !== courseId) return course;
        const current = course.progress[learnerId] ?? 0;
        return {
          ...course,
          progress: { ...course.progress, [learnerId]: Math.min(100, current + amount) },
        };
      }),
    );
  }, []);

  const changeUserRole = useCallback(
    (userId: string, role: Role): ActionResult => {
      if (!hasRole(["system_admin"])) {
        return { ok: false, message: "Only administrators can change roles." };
      }
      const user = users.find((item) => item.id === userId);
      setUsers((prev) => prev.map((item) => (item.id === userId ? { ...item, role } : item)));
      addAudit(actorName("system_admin"), "changed role of", `${user?.name ?? userId} → ${role}`);
      return { ok: true };
    },
    [actorName, addAudit, hasRole, users],
  );

  const courseById = useCallback(
    (courseId: string) => courses.find((course) => course.id === courseId),
    [courses],
  );

  const value = useMemo<LmsContextValue>(
    () => ({
      ready,
      courses,
      users,
      sessions,
      auditLogs,
      lang,
      currentUser,
      setLang,
      login,
      logout,
      register,
      approveUser,
      rejectUser,
      setUserStatus,
      courseById,
      userName: userIdLabel,
      createCourse,
      updateCourse,
      submitForApproval,
      approveCourse,
      rejectCourse,
      publishCourse,
      enrollLearners,
      enrollSelf,
      updateQuiz,
      scheduleSession,
      toggleAttendance,
      advanceProgress,
      changeUserRole,
    }),
    [
      ready,
      courses,
      users,
      sessions,
      auditLogs,
      lang,
      currentUser,
      login,
      logout,
      register,
      approveUser,
      rejectUser,
      setUserStatus,
      courseById,
      userIdLabel,
      createCourse,
      updateCourse,
      submitForApproval,
      approveCourse,
      rejectCourse,
      publishCourse,
      enrollLearners,
      enrollSelf,
      updateQuiz,
      scheduleSession,
      toggleAttendance,
      advanceProgress,
      changeUserRole,
    ],
  );

  return <LmsContext.Provider value={value}>{children}</LmsContext.Provider>;
}

export function useLms(): LmsContextValue {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error("useLms must be used within an LmsProvider");
  }
  return context;
}
