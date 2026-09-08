"use client";

import { useLms } from "@/lib/lms-store";
import { DEMO_USER_BY_ROLE } from "@/data/mock";
import PageShell from "@/components/shared/PageShell";
import PageSection from "@/components/shared/PageSection";
import { Table, Td } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AttendancePage() {
  const { sessions, users, courseById, userName, toggleAttendance } = useLms();
  const mySessions = sessions.filter((s) => s.trainerId === DEMO_USER_BY_ROLE.trainer);

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <PageShell
      role="trainer"
      title="Attendance"
      description="Mark who attended each of your live training sessions."
    >
      {mySessions.length === 0 ? (
        <EmptyState title="No sessions" description="Scheduled sessions will appear here." />
      ) : (
        mySessions.map((session) => {
          const course = courseById(session.courseId);
          const present = session.attendees.filter((a) => a.attended).length;
          return (
            <PageSection
              key={session.id}
              title={session.title}
              description={`${course?.code ?? ""} · ${formatDate(session.date)} at ${session.time} · ${present}/${session.attendees.length} present`}
            >
              {session.attendees.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-indigo-200/60 bg-white/60 px-4 py-8 text-center text-xs text-slate-400">
                  No enrolled learners in this course yet.
                </div>
              ) : (
                <Table columns={["Learner", "Department", "Status", ""]}>
                  {session.attendees.map((attendee) => {
                    const learner = users.find((u) => u.id === attendee.userId);
                    const isPresent = attendee.attended;
                    return (
                      <tr key={attendee.userId}>
                        <Td>
                          <span className="font-medium text-slate-900">
                            {userName(attendee.userId)}
                          </span>
                        </Td>
                        <Td className="text-sm text-slate-500">{learner?.department ?? "—"}</Td>
                        <Td>
                          <Badge variant={isPresent ? "green" : "slate"}>
                            {isPresent ? "Present" : "Absent"}
                          </Badge>
                        </Td>
                        <Td className="text-right">
                          <Button
                            size="sm"
                            variant={isPresent ? "outline" : "success"}
                            onClick={() => toggleAttendance(session.id, attendee.userId)}
                          >
                            {isPresent ? "Mark absent" : "Mark present"}
                          </Button>
                        </Td>
                      </tr>
                    );
                  })}
                </Table>
              )}
            </PageSection>
          );
        })
      )}
    </PageShell>
  );
}