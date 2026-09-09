"use client";

import { useState } from "react";
import { Eye, Plus, Send } from "lucide-react";
import { useLms } from "@/lib/lms-store";
import { usePagination } from "@/lib/usePagination";
import PageShell from "@/components/shared/PageShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { CourseDetailModal } from "@/components/features/courses/CourseDetailModal";
import { CreateCourseModal } from "@/components/features/courses/CreateCourseModal";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MyCoursesPage() {
  const { courses, submitForApproval } = useLms();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { page, totalPages, setPage, pageItems } = usePagination(courses, 6);

  return (
    <PageShell
      role="course_owner"
      title="My Courses"
      description="Manage your course catalog: view details, submit drafts for approval, and track status."
    >
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create New Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No courses yet"
          description="Create your first course to get started."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              extraBadge={
                course.status === "under_review" ? <Badge variant="blue">Pending review</Badge> : undefined
              }
            >
              <Button size="sm" variant="outline" onClick={() => setSelectedId(course.id)}>
                <Eye className="h-3.5 w-3.5" />
                Details
              </Button>
              {course.status === "draft" ? (
                <Button size="sm" onClick={() => submitForApproval(course.id)}>
                  <Send className="h-3.5 w-3.5" />
                  Submit for approval
                </Button>
              ) : null}
            </CourseCard>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CourseDetailModal
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        courseId={selectedId ?? ""}
      />
      <CreateCourseModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </PageShell>
  );
}