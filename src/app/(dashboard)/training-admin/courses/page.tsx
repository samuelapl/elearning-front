"use client";

import { useState } from "react";
import { Eye, Globe2 } from "lucide-react";
import { useLms } from "@/lib/lms-store";
import { usePagination } from "@/lib/usePagination";
import PageShell from "@/components/shared/PageShell";
import { Table, Td } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { CourseDetailModal } from "@/components/features/courses/CourseDetailModal";
import { userName } from "@/data/mock";

export default function CourseManagementPage() {
  const { courses, users, publishCourse } = useLms();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { page, totalPages, setPage, pageItems } = usePagination(courses, 5);

  return (
    <PageShell
      role="training_admin"
      title="Course Management"
      description="All courses in the catalog with their approval and publication status."
    >
      <Table columns={["Course", "Owner", "Approv.", "Publish", "Learners", ""]}>
        {pageItems.map((course) => (
          <tr key={course.id}>
            <Td>
              <span className="font-medium text-slate-900">{course.title}</span>
              <span className="block text-[11px] text-slate-400">
                {course.code} · {course.category}
              </span>
            </Td>
            <Td>{userName(users, course.ownerId)}</Td>
            <Td>
              <Badge variant={course.status === "approved" ? "green" : course.status === "under_review" ? "blue" : "amber"}>
                {course.status === "approved" ? "Approved" : course.status === "under_review" ? "Under review" : "Draft"}
              </Badge>
            </Td>
            <Td>
              <Badge variant={course.published ? "green" : "slate"}>
                {course.published ? "Published" : "Not published"}
              </Badge>
            </Td>
            <Td>{course.enrolledLearnerIds.length}</Td>
            <Td className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedId(course.id)}>
                  <Eye className="h-3.5 w-3.5" />
                  Details
                </Button>
                {!course.published ? (
                  <Button size="sm" onClick={() => publishCourse(course.id)}>
                    <Globe2 className="h-3.5 w-3.5" />
                    Publish
                  </Button>
                ) : null}
              </div>
            </Td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CourseDetailModal
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        courseId={selectedId ?? ""}
      />
    </PageShell>
  );
}