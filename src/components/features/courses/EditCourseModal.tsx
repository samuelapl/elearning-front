"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { COURSE_CATEGORIES } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import type { Course } from "@/types";

interface EditCourseModalProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
}

export function EditCourseModal({ open, onClose, course }: EditCourseModalProps) {
  const { updateCourse } = useLms();
  const [title, setTitle] = useState(course?.title ?? "");
  const [category, setCategory] = useState(course?.category ?? COURSE_CATEGORIES[0]);
  const [description, setDescription] = useState(course?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!course) return;
    const result = updateCourse(course.id, {
      title: title.trim(),
      category,
      description: description.trim(),
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onClose();
  };

  if (!course) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit course"
      subtitle="Update the course before resubmitting for approval."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        key={course.id}
        onChange={() => setError(null)}
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Course title</label>
          <input
            required
            defaultValue={course.title}
            onChange={(event) => setTitle(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Category</label>
          <select
            defaultValue={course.category}
            onChange={(event) => setCategory(event.target.value)}
            className={inputClass}
          >
            {COURSE_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
          <textarea
            required
            rows={4}
            defaultValue={course.description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClass}
          />
        </div>
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Modal>
  );
}
