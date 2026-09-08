"use client";

import { useState } from "react";
import { BookOpenCheck, PartyPopper, RotateCcw } from "lucide-react";
import type { Course } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useLms } from "@/lib/lms-store";
import { cn } from "@/lib/utils";

interface QuizTakerModalProps {
  open: boolean;
  onClose: () => void;
  course: Course;
}

export function QuizTakerModal({ open, onClose, course }: QuizTakerModalProps) {
  const quiz = course.quiz;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ pct: number; passed: boolean } | null>(null);
  const [started, setStarted] = useState(false);

  if (!quiz) return null;

  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  const start = () => {
    setAnswers({});
    setResult(null);
    setStarted(true);
  };

  const answer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const submit = () => {
    const earned = quiz.questions.reduce((sum, q) => {
      return sum + (answers[q.id] === q.correctIndex ? q.points : 0);
    }, 0);
    const pct = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0;
    setResult({ pct, passed: pct >= quiz.passMark });
  };

  const answeredCount = Object.keys(answers).length;
  const ready = answeredCount === quiz.questions.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={quiz.title}
      subtitle={`${course.title} · pass mark ${quiz.passMark}% · ${quiz.attemptsAllowed} attempts`}
    >
      {!started && !result ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
            <BookOpenCheck className="h-7 w-7" />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
            This quiz has {quiz.questions.length} questions and is worth {totalPoints} points.
            You need at least {quiz.passMark}% to pass.
          </p>
          <Button className="mt-6" onClick={start}>
            Start quiz
          </Button>
        </div>
      ) : result ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div
            className={cn(
              "relative flex h-20 w-20 animate-scale-in items-center justify-center rounded-full font-display text-2xl font-bold shadow-lg",
              result.passed
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/40"
                : "bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-red-500/40",
            )}
          >
            {result.passed ? (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-amber-500 shadow-md">
                <PartyPopper className="h-3.5 w-3.5" />
              </span>
            ) : null}
            {result.pct}%
          </div>
          <Badge variant={result.passed ? "green" : "red"} dot className="mt-4">
            {result.passed ? `Passed! Score ${result.pct}%` : `Not passed · ${result.pct}%`}
          </Badge>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
            {result.passed
              ? "Congratulations! You passed the quiz."
              : "Review the material and try again."}
          </p>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={start}>
              <RotateCcw className="h-4 w-4" />
              Retake
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <p className="flex items-start gap-2 text-sm font-semibold text-slate-800">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-[11px] font-bold text-white shadow-sm">
                  {index + 1}
                </span>
                {question.text}
              </p>
              <div className="mt-3 space-y-2">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[question.id] === optionIndex;
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      onClick={() => answer(question.id, optionIndex)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-150",
                        selected
                          ? "border-indigo-500 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25"
                          : "border-slate-200/80 bg-white text-slate-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
                          selected ? "border-white text-white" : "border-slate-300 text-slate-400",
                        )}
                      >
                        {optionIndex + 1}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="sticky bottom-0 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
            <p className="text-xs text-slate-500">
              {answeredCount}/{quiz.questions.length} answered
            </p>
            <Button onClick={submit} disabled={!ready}>
              Submit answers
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}