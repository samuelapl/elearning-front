"use client";

import { useState } from "react";
import { CalendarPlus, Video } from "lucide-react";
import { DEMO_USER_BY_ROLE } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import { usePagination } from "@/lib/usePagination";
import PageShell from "@/components/shared/PageShell";
import PageSection from "@/components/shared/PageSection";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
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

  const upcomingRows = usePagination(toRows(upcoming), 5);
  const pastRows = usePagination(toRows(past), 5);

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
        <SessionTable
          sessions={upcomingRows.pageItems}
          extra={(row) =>
            row.session.meetingUrl ? (
              <a href={row.session.meetingUrl} target="_blank" rel="noreferrer">
                <Button size="sm">
                  <Video className="h-3.5 w-3.5" />
                  Join
                </Button>
              </a>
            ) : null
          }
        />
        <Pagination
          page={upcomingRows.page}
          totalPages={upcomingRows.totalPages}
          onPageChange={upcomingRows.setPage}
        />
      </PageSection>

      {past.length > 0 ? (
        <PageSection title="Past sessions" description="Completed sessions with attendance records.">
          <SessionTable sessions={pastRows.pageItems} />
          <Pagination
            page={pastRows.page}
            totalPages={pastRows.totalPages}
            onPageChange={pastRows.setPage}
          />
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