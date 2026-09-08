"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLms } from "@/lib/lms-store";
import PageShell from "@/components/shared/PageShell";
import { Table, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export default function AuditLogsPage() {
  const { auditLogs } = useLms();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return auditLogs;
    return auditLogs.filter((log) =>
      [log.actor, log.action, log.target].some((field) => field.toLowerCase().includes(q)),
    );
  }, [auditLogs, query]);

  return (
    <PageShell
      role="system_admin"
      title="Audit Logs"
      description="A chronological trail of actions performed across the system."
    >
      <div className="mb-5 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search actor, action or target…"
            className="w-full rounded-xl border border-slate-200/90 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <Table columns={["Timestamp", "Actor", "Action", "Target"]}>
        {filtered.map((log) => (
          <tr key={log.id}>
            <Td className="whitespace-nowrap">
              <Badge variant="slate">{log.timestamp}</Badge>
            </Td>
            <Td className="font-medium text-slate-900">{log.actor}</Td>
            <Td>
              <span className="text-slate-600">{log.action}</span>
            </Td>
            <Td>
              <span className="text-slate-600">“{log.target}”</span>
            </Td>
          </tr>
        ))}
        {filtered.length === 0 ? (
          <tr>
            <Td colSpan={4} className="py-10 text-center text-xs text-slate-400">
              No audit entries match your search.
            </Td>
          </tr>
        ) : null}
      </Table>
    </PageShell>
  );
}