"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Video,
} from "lucide-react";
import { TODAY } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import { tr } from "@/constants/labels";
import PageShell from "@/components/shared/PageShell";
import PageSection from "@/components/shared/PageSection";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CourseCard } from "@/components/features/courses/CourseCard";

export default function LearnerDashboardPage() {
  const { courses, sessions, lang, currentUser, advanceProgress } = useLms();
  const me = currentUser?.id ?? "";
  const enrolled = courses.filter((c) => c.enrolledLearnerIds.includes(me));
  const inProgress = enrolled.filter((c) => (c.progress[me] ?? 0) < 100);
  const completed = enrolled.filter((c) => (c.progress[me] ?? 0) >= 100);
  const avg =
    enrolled.length > 0
      ? Math.round(enrolled.reduce((sum, c) => sum + (c.progress[me] ?? 0), 0) / enrolled.length)
      : 0;
  const upcoming = sessions.filter(
    (s) => s.date >= TODAY && enrolled.some((c) => c.id === s.courseId),
  );

  const nextUp = [...inProgress].sort((a, b) => (a.progress[me] ?? 0) - (b.progress[me] ?? 0))[0];

  return (
    <PageShell
      role="learner"
      title={lang === "en" ? "Learner Dashboard" : "የተማሪ ዳሽቦርድ"}
      description={tr(lang, "myCourses")}
    >
      <div className="mb-6 flex justify-end">
        <LanguageToggle />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label={tr(lang, "myCourses")} value={enrolled.length} hint={tr(lang, "inProgress")} />
        <StatCard
          icon={PlayCircle}
          label={tr(lang, "inProgress")}
          value={inProgress.length}
          hint="Courses needing attention"
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={CheckCircle2}
          label={tr(lang, "completed")}
          value={completed.length}
          hint={tr(lang, "certificates")}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard icon={Award} label={tr(lang, "averageProgress")} value={`${avg}%`} hint="Across all courses" />
      </div>

      {nextUp ? (
        <PageSection
          title="Continue learning"
          description="Resume where you left off."
          action={
            <Link href="/learner/my-courses">
              <Button variant="outline" size="sm">
                {tr(lang, "myCourses")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CourseCard
              course={nextUp}
              extraBadge={<Badge variant="blue">{nextUp.progress[me] ?? 0}%</Badge>}
            >
              <div className="w-full">
                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{tr(lang, "progress")}</span>
                  <span>{nextUp.progress[me] ?? 0}%</span>
                </div>
                <ProgressBar value={nextUp.progress[me] ?? 0} />
              </div>
              <Button size="sm" onClick={() => advanceProgress(nextUp.id, me, 5)}>
                <PlayCircle className="h-3.5 w-3.5" />
                {tr(lang, "continueLearning")}
              </Button>
            </CourseCard>
          </div>
        </PageSection>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/learner/live-sessions" className="group">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft ring-super-soft transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-indigo-200 group-hover:shadow-card">
            <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-bl from-indigo-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-slate-900">{tr(lang, "liveSessions")}</p>
                  <p className="text-xs text-slate-500">{upcoming.length} upcoming</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
            </div>
          </div>
        </Link>
        <Link href="/learner/certificates" className="group">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft ring-super-soft transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-amber-200 group-hover:shadow-card">
            <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-bl from-amber-400/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/25">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-slate-900">{tr(lang, "certificates")}</p>
                  <p className="text-xs text-slate-500">{completed.length} earned</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-500" />
            </div>
          </div>
        </Link>
      </div>
    </PageShell>
  );
}