"use client";

import { DEMO_USER_BY_ROLE } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import { tr } from "@/constants/labels";
import PageShell from "@/components/shared/PageShell";
import LanguageToggle from "@/components/shared/LanguageToggle";
import { CertificateCard } from "@/components/features/cert/CertificateCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CertificatesPage() {
  const { courses, users, lang } = useLms();
  const me = DEMO_USER_BY_ROLE.learner;
  const learner = users.find((u) => u.id === me);
  const completed = courses.filter((c) => (c.progress[me] ?? 0) >= 100);

  return (
    <PageShell
      role="learner"
      title={tr(lang, "certificates")}
      description="Certificates you have earned for completed courses."
    >
      <div className="mb-6 flex justify-end">
        <LanguageToggle />
      </div>

      {completed.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Finish a course to earn your certificate."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {completed.map((course) => (
            <CertificateCard
              key={course.id}
              course={course}
              learnerName={learner?.name ?? "Learner"}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}