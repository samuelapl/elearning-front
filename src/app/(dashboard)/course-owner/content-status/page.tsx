"use client";

import { useState } from "react";
import { Eye, Send } from "lucide-react";
import { useLms } from "@/lib/lms-store";
import { usePagination } from "@/lib/usePagination";
import PageShell from "@/components/shared/PageShell";
import { Table, Td } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { CourseDetailModal } from "@/components/features/courses/CourseDetailModal";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ContentStatusPage() {
  const { courses, submitForApproval } = useLms();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { page, totalPages, setPage, pageItems } = usePagination(courses, 5);

  return (
    <PageShell
      role="course_owner"
      title="Content Status"
      description="Monitor the approval pipeline for all your courses."
    >
      {courses.length === 0 ? (
        <EmptyState title="No courses" description="Create a course to see content status." />
      ) : (
        <Table columns={["Course", "Approval status", "Publish status", "Rejection reason", ""]}>
          {pageItems.map((course) => (
            <tr key={course.id}>
              <Td>
                <span className="font-medium text-slate-900">{course.title}</span>
                <span className="block text-[11px] text-slate-400">
                  {course.code} · {course.category}
                </span>
              </Td>
              <Td>
                <Badge variant={course.status === "draft" ? "amber" : course.status === "under_review" ? "blue" : "green"}>
                  {course.status === "draft" ? "Draft" : course.status === "under_review" ? "Under Review" : "Approved"}
                </Badge>
              </Td>
              <Td>
                <Badge variant={course.published ? "green" : "slate"}>
                  {course.published ? "Published" : "Not published"}
                </Badge>
              </Td>
              <Td className="max-w-[220px]">
                {course.rejectionReason ? (
                  <span className="text-xs text-red-600">{course.rejectionReason}</span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedId(course.id)}>
                    <Eye className="h-3.5 w-3.5" />
                    Details
                  </Button>
                  {course.status === "draft" ? (
                    <Button size="sm" onClick={() => submitForApproval(course.id)}>
                      <Send className="h-3.5 w-3.5" />
                      Submit
                    </Button>
                  ) : null}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CourseDetailModal
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        courseId={selectedId ?? ""}
      />
    </PageShell>
  );
}