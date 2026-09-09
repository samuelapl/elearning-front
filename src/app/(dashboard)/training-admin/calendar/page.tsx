"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { useLms } from "@/lib/lms-store";
import { usePagination } from "@/lib/usePagination";
import PageShell from "@/components/shared/PageShell";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SessionTable } from "@/components/features/sessions/SessionTable";
import { SessionDetailModal } from "@/components/features/sessions/SessionDetailModal";
import { TODAY } from "@/data/mock";

export default function CalendarPage() {
  const { sessions, courseById, userName } = useLms();
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
  const { page, totalPages, setPage, pageItems } = usePagination(rows, 5);

  return (
    <PageShell
      role="training_admin"
      title="Training Calendar"
      description="Upcoming live training sessions across all courses."
    >
      <SessionTable
        sessions={pageItems}
        extra={(row) => (
          <Button size="sm" variant="outline" onClick={() => setSelectedId(row.session.id)}>
            <Eye className="h-3.5 w-3.5" />
            Details
          </Button>
        )}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <SessionDetailModal
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        sessionId={selectedId ?? ""}
      />
    </PageShell>
  );
}