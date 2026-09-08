"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLms } from "@/lib/lms-store";
import PageShell from "@/components/shared/PageShell";
import { Button } from "@/components/ui/Button";
import { COURSE_CATEGORIES } from "@/data/mock";

export default function CreateCoursePage() {
  const router = useRouter();
  const { createCourse } = useLms();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState(COURSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");

  const inputClass =
    "w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";

  const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createCourse({
      title: title.trim(),
      code: code.trim().toUpperCase(),
      category,
      description: description.trim(),
    });
    router.push("/course-owner/my-courses");
  };

  return (
    <PageShell
      role="course_owner"
      title="Create New Course"
      description="A draft course with a starter module will be created in your catalog."
    >
      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft ring-super-soft">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Course title</label>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Advance Pricing Agreements"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Course code</label>
              <input
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. APA-501"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Category</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass}>
                {COURSE_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Briefly describe the course objectives…"
              className={inputClass}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Create draft</Button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}