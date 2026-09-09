"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { getRoleFromPath, ROLE_LABELS } from "@/constants/roles";
import { useLms } from "@/lib/lms-store";

function getInitials(label: string) {
  return label
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Header() {
  const pathname = usePathname();
  const { currentUser } = useLms();
  const role = currentUser?.role ?? getRoleFromPath(pathname);
  const roleLabel = role ? ROLE_LABELS[role] : "Dashboard";
  const demoUser = currentUser;

  return (
    <header className="glass sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/60 px-6">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          ELTMS · Dashboard
        </p>
        <h1 className="truncate font-display text-sm font-bold text-slate-900">{roleLabel}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, users..."
            className="h-9 w-64 rounded-xl border border-slate-200/80 bg-white/70 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm backdrop-blur transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md active:scale-95"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 animate-pulse rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5 border-l border-slate-200/80 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white shadow-md shadow-indigo-500/30 ring-1 ring-white/30">
            {getInitials(demoUser?.name ?? roleLabel)}
          </div>
          <div className="hidden leading-tight lg:block">
            <p className="text-sm font-medium text-slate-900">{demoUser?.name ?? "Demo User"}</p>
            <p className="text-[11px] text-slate-500">{demoUser?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}