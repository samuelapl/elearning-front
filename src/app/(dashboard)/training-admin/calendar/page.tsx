"use client";

import { useLms } from "@/lib/lms-store";
import PageShell from "@/components/shared/PageShell";
import { SessionTable } from "@/components/features/sessions/SessionTable";
import { TODAY } from "@/data/mock";

export default function CalendarPage() {
  const { sessions, courseById, userName } = useLms();
  const rows = sessions
    .filter((s) => s.date >= TODAY)
    .filter((s) => courseById(s.courseId))
    .map((session) => {
      const course = courseById(session.courseId)!;
      return {
        session,
        courseTitle: course.title,
        courseCode: course.code,
        trainerName: userName(session.trainerId),
      };
    });

  return (
    <PageShell
      role="training_admin"
      title="Training Calendar"
      description="Upcoming live training sessions across all courses."
    >
      <SessionTable sessions={rows} />
    </PageShell>
  );
}