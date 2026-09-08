"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { DEMO_USER_BY_ROLE } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import PageShell from "@/components/shared/PageShell";
import PageSection from "@/components/shared/PageSection";
import { Button } from "@/components/ui/Button";
import { SessionTable } from "@/components/features/sessions/SessionTable";
import { ScheduleSessionModal } from "@/components/features/sessions/ScheduleSessionModal";

export default function TrainerSessionsPage() {
  const { courses, sessions, courseById, userName } = useLms();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const assignedCourses = courses.filter((c) => c.trainerId === DEMO_USER_BY_ROLE.trainer);
  const mySessions = sessions.filter((s) => s.trainerId === DEMO_USER_BY_ROLE.trainer);
  const upcoming = mySessions.filter((s) => s.date >= "2026-09-08");
  const past = mySessions.filter((s) => s.date < "2026-09-08");

  const toRows = (items: typeof mySessions) =>
    items
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
      role="trainer"
      title="My Sessions"
      description="Your scheduled live training sessions. Upcoming sessions are highlighted."
    >
      <PageSection
        title="Upcoming sessions"
        description="Sessions still to be delivered."
        action={
          <Button onClick={() => setScheduleOpen(true)}>
            <CalendarPlus className="h-4 w-4" />
            Schedule session
          </Button>
        }
      >
        <SessionTable sessions={toRows(upcoming)} />
      </PageSection>

      {past.length > 0 ? (
        <PageSection title="Past sessions" description="Completed sessions with attendance records.">
          <SessionTable sessions={toRows(past)} />
        </PageSection>
      ) : null}

      <ScheduleSessionModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        courses={assignedCourses}
      />
    </PageShell>
  );
}