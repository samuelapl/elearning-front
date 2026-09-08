"use client";

import { useState } from "react";
import { Award, Eye } from "lucide-react";
import type { Course } from "@/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface CertificateCardProps {
  course: Course;
  learnerName: string;
  completedAt?: string;
}

export function CertificateCard({ course, learnerName, completedAt = "September 2026" }: CertificateCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card interactive className="group flex h-full flex-col">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30 transition-transform duration-200 group-hover:scale-110">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.code} · {completedAt}</CardDescription>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <Badge variant="green" dot>Earned</Badge>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            <Eye className="h-3.5 w-3.5" />
            View certificate
          </Button>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Certificate of Completion">
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/60 to-white p-8 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-200/40 blur-2xl" />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-100">
            <Award className="h-7 w-7" />
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
            Ministry of Revenues · ETIMS Academy
          </p>
          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-900">
            Certificate of Completion
          </h3>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <p className="mt-6 text-sm text-slate-600">This certifies that</p>
          <p className="mt-2 font-display text-xl font-bold text-slate-900">{learnerName}</p>
          <p className="mt-1 text-sm text-slate-500">has successfully completed</p>
          <p className="mt-2 font-display text-lg font-bold text-slate-900">{course.title}</p>
          <p className="mt-1 text-xs text-slate-400">{course.code}</p>
          <div className="mx-auto mt-8 h-px w-40 bg-slate-200" />
          <p className="mt-3 text-xs text-slate-500">Issued {completedAt}</p>
        </div>
      </Modal>
    </>
  );
}