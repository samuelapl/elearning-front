"use client";

import { useRef, useState } from "react";
import {
  Check,
  FileText,
  FileQuestion,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import type { Attachment, Question, Quiz } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useLms } from "@/lib/lms-store";
import { COURSE_CATEGORIES } from "@/data/mock";

interface CourseCreationWizardProps {
  onDone: () => void;
  onCancel: () => void;
}

const STEPS = ["Course details", "Attachments", "Final assessment"];

const inputClass =
  "w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

const blankQuestion = (): Question => ({
  id: `qn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  points: 10,
});

export function CourseCreationWizard({ onDone, onCancel }: CourseCreationWizardProps) {
  const { createCourse } = useLms();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState(COURSE_CATEGORIES[0]);
  const [description, setDescription] = useState("");

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [quizTitle, setQuizTitle] = useState("Final Assessment");
  const [passMark, setPassMark] = useState(60);
  const [attemptsAllowed, setAttemptsAllowed] = useState(2);
  const [questions, setQuestions] = useState<Question[]>([]);

  const detailsValid = title.trim() !== "" && code.trim() !== "" && description.trim() !== "";

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const added: Attachment[] = Array.from(files).map((file, index) => ({
      id: `att-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith("video") || /\.(mp4|mov|webm)$/i.test(file.name) ? "video" : "pdf",
      url: URL.createObjectURL(file),
    }));
    setAttachments((prev) => [...prev, ...added]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const addQuestion = () => setQuestions((prev) => [...prev, blankQuestion()]);

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const patchQuestion = (index: number, patch: Partial<Question>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const patchOption = (index: number, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;
        const options = q.options.map((option, j) => (j === optionIndex ? value : option));
        return { ...q, options };
      }),
    );
  };

  const handleCreate = () => {
    const quiz: Quiz | undefined =
      questions.length > 0
        ? {
            id: `q-${Date.now()}`,
            title: quizTitle.trim() || "Final Assessment",
            passMark,
            attemptsAllowed,
            questions,
          }
        : undefined;

    createCourse({
      title: title.trim(),
      code: code.trim().toUpperCase(),
      category,
      description: description.trim(),
      attachments,
      quiz,
    });
    onDone();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                index === step
                  ? "bg-brand-gradient text-white shadow-sm shadow-indigo-500/30"
                  : index < step
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-400",
              )}
            >
              {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                index === step ? "text-slate-800" : "text-slate-400",
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 ? (
              <div className="mx-1 h-px flex-1 bg-slate-200" />
            ) : null}
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Course title</label>
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
              <label className={labelClass}>Course code</label>
              <input
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. APA-501"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={category}
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
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Briefly describe the course objectives…"
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Attach course videos or PDF materials. Learners will see these alongside the course
            content.
          </p>
          <div
            className="relative rounded-2xl border-2 border-dashed border-indigo-200/60 bg-indigo-50/20 px-4 py-8 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
            }}
          >
            <Upload className="mx-auto h-6 w-6 text-indigo-400" />
            <p className="mt-2 text-xs font-medium text-slate-500">
              Drag & drop video or PDF files here, or
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*,application/pdf"
              className="hidden"
              onChange={(event) => addFiles(event.target.files)}
            />
          </div>

          {attachments.length > 0 ? (
            <ul className="space-y-2">
              {attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm"
                >
                  <span className="flex items-center gap-2 text-sm text-slate-700">
                    {attachment.type === "video" ? (
                      <Video className="h-4 w-4 text-indigo-500/70" />
                    ) : (
                      <FileText className="h-4 w-4 text-indigo-500/70" />
                    )}
                    {attachment.name}
                    <Badge variant="outline">{attachment.type}</Badge>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove attachment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Build the multiple-choice final assessment learners must pass to complete this course.
            This step is optional.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>Assessment title</label>
              <input
                value={quizTitle}
                onChange={(event) => setQuizTitle(event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pass mark (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={passMark}
                onChange={(event) => setPassMark(Number(event.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Allowed attempts</label>
              <input
                type="number"
                min={1}
                value={attemptsAllowed}
                onChange={(event) => setAttemptsAllowed(Number(event.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-indigo-200/60 bg-indigo-50/20 px-4 py-8 text-center">
                <p className="text-xs font-medium text-slate-500">
                  No questions yet. Add questions below.
                </p>
              </div>
            ) : (
              questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <label className="block flex-1">
                      <span className={labelClass}>Question {index + 1}</span>
                      <input
                        value={question.text}
                        onChange={(event) => patchQuestion(index, { text: event.target.value })}
                        placeholder="Enter the question…"
                        className={inputClass}
                      />
                    </label>
                    <label className="w-28">
                      <span className={labelClass}>Points</span>
                      <input
                        type="number"
                        min={1}
                        value={question.points}
                        onChange={(event) =>
                          patchQuestion(index, { points: Number(event.target.value) })
                        }
                        className={inputClass}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="mt-5 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-colors",
                          question.correctIndex === optionIndex
                            ? "border-indigo-300 bg-indigo-50/50"
                            : "border-slate-200/80 bg-white",
                        )}
                      >
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctIndex === optionIndex}
                          onChange={() => patchQuestion(index, { correctIndex: optionIndex })}
                          className="h-4 w-4 accent-indigo-600"
                        />
                        <input
                          value={option}
                          onChange={(event) => patchOption(index, optionIndex, event.target.value)}
                          placeholder={`Option ${optionIndex + 1}${question.correctIndex === optionIndex ? " (correct)" : ""}`}
                          className="w-full border-transparent bg-transparent px-0.5 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="h-4 w-4" />
            Add question
          </Button>
        </div>
      ) : null}

      <div className="flex justify-between gap-2 border-t border-slate-100 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => (step === 0 ? onCancel() : setStep((s) => s - 1))}
        >
          {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" disabled={step === 0 && !detailsValid} onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
        ) : (
          <Button type="button" onClick={handleCreate}>
            <FileQuestion className="h-4 w-4" />
            Create course
          </Button>
        )}
      </div>
    </div>
  );
}
