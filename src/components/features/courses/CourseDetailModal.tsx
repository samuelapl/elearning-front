"use client";

import { CalendarDays, ClipboardPen, FileText, UserRound, Video } from "lucide-react";
import type { Course } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Badge, CourseStatusBadge } from "@/components/ui/Badge";
import { useLms } from "@/lib/lms-store";
import { cn } from "@/lib/utils";

interface CourseDetailModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
}

export function CourseDetailModal({
  open,
  onClose,
  courseId,
}: CourseDetailModalProps) {
  const { courseById, userName } = useLms();
  const course = courseById(courseId);

  if (!course) return null;

  const totalPoints =
    course.quiz?.questions.reduce((sum, q) => sum + q.points, 0) ?? 0;

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
          <CourseStatusBadge
            status={course.published ? "published" : course.status}
          />
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

        <p className="text-sm leading-relaxed text-slate-600">
          {course.description}
        </p>

        {course.rejectionReason ? (
          <div className="rounded-xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-700">
            <p className="font-medium">Rejection reason</p>
            <p className="mt-0.5">{course.rejectionReason}</p>
          </div>
        ) : null}

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Modules & Lessons
          </h3>
          <div className="space-y-3">
            {course.modules.map((module, index) => (
              <div
                key={module.id}
                className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
                  <p className="text-sm font-semibold text-slate-800">
                    {module.title}
                  </p>
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

        {course.attachments && course.attachments.length > 0 ? (
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Attachments
            </h3>
            <ul className="space-y-2">
              {course.attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm"
                >
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-700 hover:text-indigo-600"
                  >
                    {attachment.type === "video" ? (
                      <Video className="h-4 w-4 text-indigo-500/70" />
                    ) : (
                      <FileText className="h-4 w-4 text-indigo-500/70" />
                    )}
                    {attachment.name}
                  </a>
                  <Badge variant="outline">{attachment.type}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {course.quiz ? (
          <div>
            <h3 className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Final Assessment</span>
              <Badge variant="green" dot>
                Quiz ready
              </Badge>
            </h3>
            <div className="rounded-xl bg-gradient-to-r from-indigo-50/80 to-violet-50/80 px-4 py-3 ring-1 ring-inset ring-indigo-200/50">
              <p className="text-sm font-semibold text-slate-800">{course.quiz.title}</p>
              <p className="text-[11px] text-slate-500">
                {course.quiz.questions.length} questions · {totalPoints} points
                · pass mark {course.quiz.passMark}% ·{" "}
                {course.quiz.attemptsAllowed} attempts
              </p>
            </div>
            <div className="mt-3 space-y-2">
              {course.quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {index + 1}. {question.text}
                  </p>
                  <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <li
                        key={optionIndex}
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-xs",
                          question.correctIndex === optionIndex
                            ? "bg-emerald-50 font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200/60"
                            : "text-slate-500",
                        )}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
