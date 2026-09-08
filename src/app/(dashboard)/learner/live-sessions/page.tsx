"use client";

import { useState } from "react";
import { Video, MonitorPlay } from "lucide-react";
import { DEMO_USER_BY_ROLE, TODAY } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import { tr } from "@/constants/labels";
import PageShell from "@/components/shared/PageShell";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SessionTable } from "@/components/features/sessions/SessionTable";
import { EmptyState } from "@/components/ui/EmptyState";

export default function LiveSessionsPage() {
  const { courses, sessions, courseById, userName, lang } = useLms();
  const me = DEMO_USER_BY_ROLE.learner;
  const [joined, setJoined] = useState<string[]>([]);

  const enrolledCourseIds = courses
    .filter((c) => c.enrolledLearnerIds.includes(me))
    .map((c) => c.id);

  const rows = sessions
    .filter((s) => s.date >= TODAY && enrolledCourseIds.includes(s.courseId))
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

  const join = (id: string) => {
    setJoined((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <PageShell
      role="learner"
      title={tr(lang, "liveSessions")}
      description="Upcoming live sessions for the courses you are enrolled in."
    >
      <div className="mb-6 flex justify-end">
        <LanguageToggle />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No live sessions" description="New sessions will appear here." />
      ) : (
        <SessionTable
          sessions={rows}
extra={(row) =>
            joined.includes(row.session.id) ? (
              <Badge variant="green">Joined</Badge>
            ) : (
              <Button size="sm" onClick={() => join(row.session.id)}>
                <MonitorPlay className="h-3.5 w-3.5" />
                {tr(lang, "join")}
              </Button>
            )
          }
        />
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <Video className="h-4 w-4" />
        Joining a session is simulated for the demo — sessions are delivered live in production.
      </div>
    </PageShell>
  );
}