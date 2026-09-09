"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileQuestion, Presentation, Video } from "lucide-react";
import { DEMO_USER_BY_ROLE } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import { usePagination } from "@/lib/usePagination";
import PageShell from "@/components/shared/PageShell";
import PageSection from "@/components/shared/PageSection";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { TODAY } from "@/data/mock";

const QUICK_LINKS = [
  {
    href: "/trainer/sessions",
    title: "My Sessions",
    description: "Schedule and manage live sessions.",
    icon: Presentation,
  },
  {
    href: "/trainer/create-quiz",
    title: "Create Quiz",
    description: "Build and manage course quizzes.",
    icon: FileQuestion,
  },
  {
    href: "/trainer/attendance",
    title: "Attendance",
    description: "Mark attendance for live sessions.",
    icon: ClipboardCheck,
  },
];

export default function TrainerDashboardPage() {
  const { courses, sessions } = useLms();
  const assigned = courses.filter((c) => c.trainerId === DEMO_USER_BY_ROLE.trainer);
  const upcoming = sessions.filter(
    (s) => s.date >= TODAY && s.trainerId === DEMO_USER_BY_ROLE.trainer,
  );
  const quizzes = assigned.filter((c) => c.quiz);
  const assignedPage = usePagination(assigned, 3);

  return (
    <PageShell
      role="trainer"
      title="Trainer Dashboard"
      description="Run live sessions, create quizzes, and track learner attendance."
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Presentation} label="Assigned courses" value={assigned.length} hint="Courses you train" />
        <StatCard
          icon={Video}
          label="Upcoming sessions"
          value={upcoming.length}
          hint="In the next weeks"
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={FileQuestion}
          label="Quizzes created"
          value={quizzes.length}
          hint="Across your courses"
        />
      </div>

      <PageSection
        title="My courses"
        description="Courses assigned to you for facilitation."
        action={
          <Link href="/trainer/sessions">
            <Button variant="outline" size="sm">
              All sessions
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assignedPage.pageItems.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              extraBadge={course.quiz ? <Badge variant="green">Quiz ready</Badge> : undefined}
            >
              <Link href="/trainer/create-quiz">
                <Button size="sm" variant="outline">
                  Manage quiz
                </Button>
              </Link>
            </CourseCard>
          ))}
        </div>
        <Pagination
          page={assignedPage.page}
          totalPages={assignedPage.totalPages}
          onPageChange={assignedPage.setPage}
        />
      </PageSection>

      <PageSection title="Quick actions" description="Common trainer tasks.">
        <div className="grid gap-4 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="group">
                <Card interactive className="flex h-full flex-col justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4">
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-500 transition-transform duration-200 group-hover:translate-x-0.5">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </PageSection>
    </PageShell>
  );
}