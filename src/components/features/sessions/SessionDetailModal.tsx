"use client";

import { CalendarDays, Clock, Link2, UserRound } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Table, Td } from "@/components/ui/Table";
import { useLms } from "@/lib/lms-store";

interface SessionDetailModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
}

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function SessionDetailModal({ open, onClose, sessionId }: SessionDetailModalProps) {
  const { sessions, courseById, userName } = useLms();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) return null;

  const course = courseById(session.courseId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={session.title}
      subtitle={`${course ? `${course.code} · ` : ""}${formatDate(session.date)} at ${session.time}`}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-2 py-1 text-xs text-slate-600">
            <CalendarDays className="h-3.5 w-3.5 text-indigo-500/70" />
            {formatDate(session.date)} · {session.time}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-2 py-1 text-xs text-slate-600">
            <Clock className="h-3.5 w-3.5 text-indigo-500/70" />
            {session.durationMin} minutes
          </span>
          {session.meetingUrl ? (
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50/80 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100"
            >
              <Link2 className="h-3.5 w-3.5" />
              Meeting link
            </a>
          ) : null}
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Trainer attendance
          </h3>
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
              <UserRound className="h-3.5 w-3.5 text-indigo-500/70" />
              {userName(session.trainerId)}
            </span>
            <Badge variant={session.trainerAttended ? "green" : "slate"} dot>
              {session.trainerAttended ? "Present" : "Absent"}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Learner attendance
          </h3>
          {session.attendees.length === 0 ? (
            <div className="rounded-xl border border-dashed border-indigo-200/60 bg-white/60 px-4 py-6 text-center text-xs text-slate-400">
              No enrolled learners for this session.
            </div>
          ) : (
            <Table columns={["Learner", "Status"]}>
              {session.attendees.map((attendee) => (
                <tr key={attendee.userId}>
                  <Td className="font-medium text-slate-900">{userName(attendee.userId)}</Td>
                  <Td>
                    <Badge variant={attendee.attended ? "green" : "slate"} dot>
                      {attendee.attended ? "Present" : "Absent"}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </div>
    </Modal>
  );
}
