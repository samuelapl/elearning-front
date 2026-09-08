"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ROLES, ROLE_LABELS } from "@/constants/roles";
import { useLms } from "@/lib/lms-store";
import PageShell from "@/components/shared/PageShell";
import { Table, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import type { Role } from "@/types";

function roleBadgeVariant(role: Role) {
  switch (role) {
    case "system_admin":
      return "red";
    case "content_approver":
    case "training_admin":
      return "blue";
    case "trainer":
      return "amber";
    case "learner":
      return "slate";
    default:
      return "green";
  }
}

export default function UsersPage() {
  const { users, changeUserRole } = useLms();
  const [flash, setFlash] = useState<string | null>(null);

  const change = (userId: string, role: Role) => {
    changeUserRole(userId, role);
    const user = users.find((u) => u.id === userId);
    setFlash(`${user?.name ?? "User"} is now ${ROLE_LABELS[role]}`);
  };

  return (
    <PageShell
      role="system_admin"
      title="Users & Roles"
      description="Manage user accounts and change role assignments. Changes are recorded in the audit log."
    >
      {flash ? (
        <div className="mb-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-2.5 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
          <CheckCircle2 className="h-4 w-4" />
          {flash}
        </div>
      ) : null}

      <Table columns={["User", "Email", "Department", "Role", "Change role"]}>
        {users.map((user) => (
          <tr key={user.id}>
            <Td>
              <span className="font-medium text-slate-900">{user.name}</span>
            </Td>
            <Td>
              <span className="text-slate-500">{user.email}</span>
            </Td>
            <Td>
              <span className="text-slate-500">{user.department}</span>
            </Td>
            <Td>
              <Badge variant={roleBadgeVariant(user.role)}>{ROLE_LABELS[user.role]}</Badge>
            </Td>
            <Td>
              <select
                value={user.role}
                onChange={(event) => change(user.id, event.target.value as Role)}
                className="rounded-xl border border-slate-200/90 bg-white px-2.5 py-1.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </Td>
          </tr>
        ))}
      </Table>
    </PageShell>
  );
}