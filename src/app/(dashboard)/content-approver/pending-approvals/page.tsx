"use client";

import { useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { useLms } from "@/lib/lms-store";
import { usePagination } from "@/lib/usePagination";
import PageShell from "@/components/shared/PageShell";
import { Table, Td } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { CourseDetailModal } from "@/components/features/courses/CourseDetailModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { userName } from "@/data/mock";

export default function PendingApprovalsPage() {
  const { courses, users, approveCourse, rejectCourse } = useLms();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const pending = courses.filter((c) => c.status === "under_review");
  const { page, totalPages, setPage, pageItems } = usePagination(pending, 5);
  const rejectCourseData = courses.find((c) => c.id === rejectId);

  const confirmReject = () => {
    if (rejectId) {
      rejectCourse(rejectId, reason.trim() || "Content does not meet quality standards");
      setRejectId(null);
      setReason("");
    }
  };

  return (
    <PageShell
      role="content_approver"
      title="Pending Approvals"
      description="Review submissions and approve or reject course content."
    >
      {pending.length === 0 ? (
        <EmptyState
          title="No pending approvals"
          description="The approval queue is empty. New submissions will appear here."
        />
      ) : (
        <Table columns={["Course", "Owner", "Category", "Content", ""]}>
          {pageItems.map((course) => (
            <tr key={course.id}>
              <Td>
                <span className="font-medium text-slate-900">{course.title}</span>
                <span className="block text-[11px] text-slate-400">{course.code}</span>
              </Td>
              <Td>{userName(users, course.ownerId)}</Td>
              <Td>
                <Badge variant="outline">{course.category}</Badge>
              </Td>
              <Td>
                <span className="text-[11px] text-slate-500">
                  {course.modules.length} modules ·{" "}
                  {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                </span>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedId(course.id)}>
                    <Eye className="h-3.5 w-3.5" />
                    Review
                  </Button>
                  <Button size="sm" variant="success" onClick={() => approveCourse(course.id)}>
                    <Check className="h-3.5 w-3.5" />
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setRejectId(course.id)}>
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </Button>
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

      <Modal
        open={rejectId !== null}
        onClose={() => setRejectId(null)}
        title="Reject course"
        subtitle={rejectCourseData ? `${rejectCourseData.code} — ${rejectCourseData.title}` : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmReject}>
              Reject course
            </Button>
          </>
        }
      >
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
          Rejection reason (sent to the course owner)
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="e.g. Please add learning objectives and a course assessment."
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
        />
      </Modal>
    </PageShell>
  );
}