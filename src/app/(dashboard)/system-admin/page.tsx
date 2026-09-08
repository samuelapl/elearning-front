"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ScrollText, Settings, ShieldCheck, UsersRound, Video } from "lucide-react";
import { TODAY } from "@/data/mock";
import { useLms } from "@/lib/lms-store";
import PageShell from "@/components/shared/PageShell";
import PageSection from "@/components/shared/PageSection";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const QUICK_LINKS = [
  {
    href: "/system-admin/users",
    title: "Users & Roles",
    description: "Manage users and change roles.",
    icon: UsersRound,
  },
  {
    href: "/system-admin/settings",
    title: "System Settings",
    description: "Platform configuration.",
    icon: Settings,
  },
  {
    href: "/system-admin/audit-logs",
    title: "Audit Logs",
    description: "Track all system activity.",
    icon: ScrollText,
  },
];

export default function SystemAdminDashboardPage() {
  const { users, courses, auditLogs, sessions } = useLms();
  const activeSessions = sessions.filter((s) => s.date >= TODAY).length;

  return (
    <PageShell
      role="system_admin"
      title="System Administrator Dashboard"
      description="Monitor platform health, manage users and roles, and review audit activity."
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UsersRound} label="Total users" value={users.length} hint="All roles" />
        <StatCard
          icon={BookOpen}
          label="Courses"
          value={courses.length}
          hint="In the catalog"
          iconClassName="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={Video}
          label="Active sessions"
          value={activeSessions}
          hint="Upcoming live sessions"
          iconClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={ShieldCheck}
          label="Audit actions"
          value={auditLogs.length}
          hint="Tracked this period"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <PageSection title="Quick actions" description="Common administrative tasks.">
            <div className="space-y-4">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className="group block">
                    <Card interactive className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle>{link.title}</CardTitle>
                          <CardDescription>{link.description}</CardDescription>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                    </Card>
                  </Link>
                );
              })}
            </div>
          </PageSection>
        </div>

        <div className="lg:col-span-3">
          <PageSection
            title="Recent activity"
            description="Latest entries in the audit trail."
            action={
              <Link href="/system-admin/audit-logs">
                <Button variant="outline" size="sm">
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            }
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-soft ring-super-soft">
              <ul className="divide-y divide-slate-100/80">
                {auditLogs.slice(0, 5).map((log) => (
                  <li key={log.id} className="flex items-start justify-between gap-4 px-5 py-3 transition-colors hover:bg-indigo-50/30">
                    <div>
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{log.actor}</span> {log.action}{" "}
                        <span className="font-medium">“{log.target}”</span>
                      </p>
                      <Badge variant="slate" className="mt-1.5">
                        {log.timestamp}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </PageSection>
        </div>
      </div>
    </PageShell>
  );
}