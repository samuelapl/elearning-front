"use client";

import { DEMO_USER_BY_ROLE } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import { tr } from "@/constants/labels";
import PageShell from "@/components/shared/PageShell";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { Table, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProgressPage() {
  const { courses, lang } = useLms();
  const me = DEMO_USER_BY_ROLE.learner;
  const enrolled = courses
    .filter((c) => c.enrolledLearnerIds.includes(me))
    .sort((a, b) => (a.progress[me] ?? 0) - (b.progress[me] ?? 0));

  return (
    <PageShell
      role="learner"
      title={tr(lang, "progress")}
      description="Your completion progress across all enrolled courses."
    >
      <div className="mb-6 flex justify-end">
        <LanguageToggle />
      </div>

      {enrolled.length === 0 ? (
        <EmptyState title="No courses" description="Enrolled courses will appear here." />
      ) : (
        <Table columns={["Course", "Category", "Progress", "Status"]}>
          {enrolled.map((course) => {
            const progress = course.progress[me] ?? 0;
            const done = progress >= 100;
            return (
              <tr key={course.id}>
                <Td>
                  <span className="font-medium text-slate-900">{course.title}</span>
                  <span className="block text-[11px] text-slate-400">{course.code}</span>
                </Td>
                <Td>
                  <Badge variant="outline">{course.category}</Badge>
                </Td>
                <Td className="w-64">
                  <div className="flex items-center gap-3">
                    <ProgressBar value={progress} className="flex-1" />
                    <span className="w-10 text-right text-xs font-medium text-slate-600">
                      {progress}%
                    </span>
                  </div>
                </Td>
                <Td>
                  <Badge variant={done ? "green" : "blue"}>{done ? tr(lang, "completed") : tr(lang, "inProgress")}</Badge>
                </Td>
              </tr>
            );
          })}
        </Table>
      )}
    </PageShell>
  );
}