"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_USER_BY_ROLE,
  INITIAL_AUDIT_LOGS,
  INITIAL_COURSES,
  INITIAL_SESSIONS,
  INITIAL_USERS,
} from "@/data/mock";
import type {
  Attachment,
  AuditLog,
  Course,
  Lang,
  LiveSession,
  Quiz,
  Role,
  User,
} from "@/types";

interface LmsContextValue {
  courses: Course[];
  users: User[];
  sessions: LiveSession[];
  auditLogs: AuditLog[];
  lang: Lang;
  setLang: (lang: Lang) => void;
  courseById: (courseId: string) => Course | undefined;
  userName: (userId: string) => string;
  createCourse: (input: {
    code: string;
    title: string;
    category: string;
    description: string;
    attachments?: Attachment[];
    quiz?: Quiz;
  }) => void;
  submitForApproval: (courseId: string) => void;
  approveCourse: (courseId: string) => void;
  rejectCourse: (courseId: string, reason: string) => void;
  publishCourse: (courseId: string) => void;
  enrollLearners: (courseId: string, learnerIds: string[]) => void;
  updateQuiz: (courseId: string, quiz: Quiz) => void;
  scheduleSession: (input: {
    courseId: string;
    title: string;
    date: string;
    time: string;
    durationMin: number;
    meetingUrl?: string;
  }) => void;
  toggleAttendance: (sessionId: string, userId: string) => void;
  toggleTrainerAttendance: (sessionId: string) => void;
  advanceProgress: (courseId: string, learnerId: string, amount: number) => void;
  changeUserRole: (userId: string, role: Role) => void;
}

const LmsContext = createContext<LmsContextValue | null>(null);

export function LmsProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [sessions, setSessions] = useState<LiveSession[]>(INITIAL_SESSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [lang, setLang] = useState<Lang>("en");

  const actorFor = (role: Role) => {
    const id = DEMO_USER_BY_ROLE[role];
    return users.find((user) => user.id === id)?.name ?? "Demo User";
  };

  const addAudit = useCallback(
    (actor: string, action: string, target: string) => {
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate(),
      ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}`;
      setAuditLogs((prev) => [
        { id: `al${prev.length + 1}`, actor, action, target, timestamp },
        ...prev,
      ]);
    },
    [],
  );

  const userIdLabel = useCallback(
    (userId: string) => users.find((user) => user.id === userId)?.name ?? "Unknown",
    [users],
  );

  const createCourse: LmsContextValue["createCourse"] = useCallback(
    (input) => {
      const newCourse: Course = {
        id: `c${courses.length + 1}`,
        code: input.code || "TBD-000",
        title: input.title,
        category: input.category,
        description: input.description,
        ownerId: DEMO_USER_BY_ROLE.course_owner,
        trainerId: null,
        status: "draft",
        published: false,
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
        attachments: input.attachments ?? [],
        quiz: input.quiz,
      };
      setCourses((prev) => [...prev, newCourse]);
      addAudit(actorFor("course_owner"), "created course", newCourse.title);
    },
    [addAudit, courses.length],
  );

  const submitForApproval = useCallback(
    (courseId: string) => {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? { ...course, status: "under_review", rejectionReason: undefined }
            : course,
        ),
      );
      addAudit(
        actorFor("course_owner"),
        "submitted course for approval",
        courses.find((course) => course.id === courseId)?.title ?? courseId,
      );
    },
    [addAudit, courses],
  );

  const approveCourse = useCallback(
    (courseId: string) => {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, status: "approved" } : course,
        ),
      );
      addAudit(
        actorFor("content_approver"),
        "approved course",
        courses.find((course) => course.id === courseId)?.title ?? courseId,
      );
    },
    [addAudit, courses],
  );

  const rejectCourse = useCallback(
    (courseId: string, reason: string) => {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? { ...course, status: "draft", rejectionReason: reason }
            : course,
        ),
      );
      addAudit(
        actorFor("content_approver"),
        "rejected course: " + reason,
        courses.find((course) => course.id === courseId)?.title ?? courseId,
      );
    },
    [addAudit, courses],
  );

  const publishCourse = useCallback(
    (courseId: string) => {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, published: true } : course,
        ),
      );
      addAudit(
        actorFor("training_admin"),
        "published course",
        courses.find((course) => course.id === courseId)?.title ?? courseId,
      );
    },
    [addAudit, courses],
  );

  const enrollLearners = useCallback(
    (courseId: string, learnerIds: string[]) => {
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
        actorFor("training_admin"),
        `enrolled ${learnerIds.length} learner(s)`,
        courses.find((course) => course.id === courseId)?.title ?? courseId,
      );
    },
    [addAudit, courses],
  );

  const updateQuiz = useCallback(
    (courseId: string, quiz: Quiz) => {
      setCourses((prev) =>
        prev.map((course) => (course.id === courseId ? { ...course, quiz } : course)),
      );
      addAudit(
        actorFor("trainer"),
        quiz.questions.length > 0 ? "updated quiz" : "created quiz",
        quiz.title,
      );
    },
    [addAudit],
  );

  const scheduleSession = useCallback(
    (input: {
      courseId: string;
      title: string;
      date: string;
      time: string;
      durationMin: number;
      meetingUrl?: string;
    }) => {
      const course = courses.find((c) => c.id === input.courseId);
      setSessions((prev) => [
        ...prev,
        {
          id: `s${prev.length + 1}`,
          courseId: input.courseId,
          title: input.title,
          date: input.date,
          time: input.time,
          durationMin: input.durationMin,
          trainerId: DEMO_USER_BY_ROLE.trainer,
          meetingUrl: input.meetingUrl,
          trainerAttended: false,
          attendees: (course?.enrolledLearnerIds ?? []).map((userId) => ({
            userId,
            attended: false,
          })),
        },
      ]);
      addAudit(actorFor("trainer"), "scheduled live session", input.title);
    },
    [addAudit, courses],
  );

  const toggleAttendance = useCallback(
    (sessionId: string, userId: string) => {
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
    },
    [],
  );

  const toggleTrainerAttendance = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, trainerAttended: !session.trainerAttended }
          : session,
      ),
    );
  }, []);

  const advanceProgress = useCallback(
    (courseId: string, learnerId: string, amount: number) => {
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
    },
    [],
  );

  const changeUserRole = useCallback(
    (userId: string, role: Role) => {
      const user = users.find((u) => u.id === userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );
      addAudit(actorFor("system_admin"), "changed role of", `${user?.name ?? userId} → ${role}`);
    },
    [addAudit, users],
  );

  const courseById = useCallback(
    (courseId: string) => courses.find((course) => course.id === courseId),
    [courses],
  );

  const value = useMemo<LmsContextValue>(
    () => ({
      courses,
      users,
      sessions,
      auditLogs,
      lang,
      setLang,
      courseById,
      userName: userIdLabel,
      createCourse,
      submitForApproval,
      approveCourse,
      rejectCourse,
      publishCourse,
      enrollLearners,
      updateQuiz,
      scheduleSession,
      toggleAttendance,
      toggleTrainerAttendance,
      advanceProgress,
      changeUserRole,
    }),
    [
      courses,
      users,
      sessions,
      auditLogs,
      lang,
      courseById,
      userIdLabel,
      createCourse,
      submitForApproval,
      approveCourse,
      rejectCourse,
      publishCourse,
      enrollLearners,
      updateQuiz,
      scheduleSession,
      toggleAttendance,
      toggleTrainerAttendance,
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