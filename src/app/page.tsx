import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { ROLE_LABELS } from "@/constants/roles";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-center">
      
      <div className="pointer-events-none absolute inset-0 bg-hero-gradient" />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-60" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-sky-600/10 blur-3xl" />

      <div className="relative w-full max-w-xl animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-2xl shadow-indigo-900/50 ring-1 ring-white/20">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>

        <div className="mx-auto mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-indigo-200 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Ministry of Revenues · Ethiopia
        </div>

        <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight text-white">
          ELTMS
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Tele E-Learning Training Management System
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 ring-1 ring-white/20 transition-all duration-200 hover:shadow-indigo-700/50 hover:brightness-110 active:scale-[0.97]"
          >
            Sign in
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300 backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />6 workplace
            roles
          </span>
        </div>

        <div className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-2">
          {Object.values(ROLE_LABELS).map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
