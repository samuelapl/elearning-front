"use client";

import { CalendarDays, ClipboardPen, UserRound } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge, CourseStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useLms } from "@/lib/lms-store";

interface CourseDetailModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  reviewActions?: {
    onApprove: () => void;
    onReject: () => void;
  };
}

export function CourseDetailModal({
  open,
  onClose,
  courseId,
  reviewActions,
}: CourseDetailModalProps) {
  const { courseById, userName } = useLms();
  const course = courseById(courseId);

  if (!course) return null;

  const totalPoints = course.quiz?.questions.reduce((sum, q) => sum + q.points, 0) ?? 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={course.title}
      subtitle={`${course.code} · ${course.category}`}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <CourseStatusBadge status={course.published ? "published" : course.status} />
          <Badge variant="outline">{course.category}</Badge>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-2 py-1 text-xs text-slate-600">
            <UserRound className="h-3.5 w-3.5 text-indigo-500/70" />
            Owner: {userName(course.ownerId)}
          </span>
          {course.trainerId ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/80 px-2 py-1 text-xs text-slate-600">
              <UserRound className="h-3.5 w-3.5 text-indigo-500/70" />
              Trainer: {userName(course.trainerId)}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-relaxed text-slate-600">{course.description}</p>

        {course.rejectionReason ? (
          <div className="rounded-xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-700">
            <p className="font-medium">Admin feedback</p>
            <p className="mt-0.5">{course.rejectionReason}</p>
            {course.rejectedBy || course.rejectedAt ? (
              <p className="mt-1 text-[11px] text-red-500/80">
                {course.rejectedBy ? `Rejected by ${course.rejectedBy}` : null}
                {course.rejectedAt ? ` · ${course.rejectedAt}` : null}
              </p>
            ) : null}
          </div>
        ) : null}

        {!course.rejectionReason && course.lastRejectionReason ? (
          <div className="rounded-xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm text-amber-800">
            <p className="font-medium">Previous admin feedback</p>
            <p className="mt-0.5">{course.lastRejectionReason}</p>
          </div>
        ) : null}

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Modules & Lessons
          </h3>
          <div className="space-y-3">
            {course.modules.map((module, index) => (
              <div key={module.id} className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
                  <p className="text-sm font-semibold text-slate-800">{module.title}</p>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-[11px] text-slate-500 ring-1 ring-slate-200/70">
                    <ClipboardPen className="h-3.5 w-3.5 text-indigo-500/70" />
                    {module.lessons.length} lessons
                  </span>
                </div>
                <ul className="divide-y divide-slate-100">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-indigo-50/30"
                    >
                      <span>
                        {index + 1}.{lessonIndex + 1} · {lesson.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {lesson.durationMin} min
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {course.quiz ? (
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-50/80 to-violet-50/80 px-4 py-3 ring-1 ring-inset ring-indigo-200/50">
            <div>
              <p className="text-sm font-semibold text-slate-800">{course.quiz.title}</p>
              <p className="text-[11px] text-slate-500">
                {course.quiz.questions.length} questions · {totalPoints} points · pass mark{" "}
                {course.quiz.passMark}% · {course.quiz.attemptsAllowed} attempts
              </p>
            </div>
            <Badge variant="green" dot>Quiz ready</Badge>
          </div>
        ) : (
          <p className="text-xs text-slate-400">No assessment has been attached yet.</p>
        )}

        {reviewActions ? (
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="danger" onClick={reviewActions.onReject}>
              Reject course
            </Button>
            <Button variant="success" onClick={reviewActions.onApprove}>
              Approve course
            </Button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}