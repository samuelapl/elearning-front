"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, PlayCircle } from "lucide-react";
import { useLms } from "@/lib/lms-store";
import { tr } from "@/constants/labels";
import PageShell from "@/components/shared/PageShell";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { QuizTakerModal } from "@/components/features/quiz/QuizTakerModal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Course } from "@/types";

export default function LearnerCoursesPage() {
  const { courses, lang, currentUser, advanceProgress } = useLms();
  const me = currentUser?.id ?? "";
  const enrolled = courses.filter((c) => c.enrolledLearnerIds.includes(me));
  const [quizCourse, setQuizCourse] = useState<Course | null>(null);

  return (
    <PageShell
      role="learner"
      title={tr(lang, "myCourses")}
      description="Courses you are enrolled in. Click continue to advance your progress (demo)."
    >
      <div className="mb-6 flex justify-end">
        <LanguageToggle />
      </div>

      {enrolled.length === 0 ? (
        <EmptyState
          title="No enrollments yet"
          description="Enrolled courses will appear here."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrolled.map((course) => {
            const progress = course.progress[me] ?? 0;
            const done = progress >= 100;
            return (
              <CourseCard
                key={course.id}
                course={course}
                extraBadge={
                  done ? (
                    <Badge variant="green">{tr(lang, "completed")}</Badge>
                  ) : (
                    <Badge variant="blue">{progress}%</Badge>
                  )
                }
              >
                <div className="w-full">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{tr(lang, "progress")}</span>
                    <span>{progress}%</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
                {!done ? (
                  <Button size="sm" onClick={() => advanceProgress(course.id, me, 5)}>
                    <PlayCircle className="h-3.5 w-3.5" />
                    {tr(lang, "continueLearning")} +5%
                  </Button>
                ) : (
                  <Link href="/learner/certificates">
                    <Button size="sm" variant="outline">
                      <Award className="h-3.5 w-3.5" />
                      {tr(lang, "certificates")}
                    </Button>
                  </Link>
                )}
                {course.quiz ? (
                  <Button size="sm" variant="outline" onClick={() => setQuizCourse(course)}>
                    {tr(lang, "takeQuiz")}
                    {` · ${course.quiz.passMark}% to pass`}
                  </Button>
                ) : null}
              </CourseCard>
            );
          })}
        </div>
      )}

      {quizCourse ? (
        <QuizTakerModal
          open={quizCourse !== null}
          onClose={() => setQuizCourse(null)}
          course={quizCourse}
        />
      ) : null}
    </PageShell>
  );
}