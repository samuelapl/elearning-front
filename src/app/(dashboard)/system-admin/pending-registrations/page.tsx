"use client";

import { useMemo, useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { useLms } from "@/lib/lms-store";
import PageShell from "@/components/shared/PageShell";
import { Table, Td } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { UserStatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import type { User } from "@/types";

export default function PendingRegistrationsPage() {
  const { users, approveUser, rejectUser } = useLms();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; action: "approve" | "reject" } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((user) => {
      if (status === "pending" && user.status !== "pending") return false;
      if (status === "rejected" && user.status !== "rejected") return false;
      if (status === "active" && !(user.status === "active" && user.role === "learner")) return false;
      if (status === "all" && user.status !== "pending" && user.status !== "rejected") return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q)
      );
    });
  }, [users, search, status]);

  const runAction = () => {
    if (!confirm) return;
    const result =
      confirm.action === "approve" ? approveUser(confirm.id) : rejectUser(confirm.id);
    setFlash(result.ok ? `Registration ${confirm.action}d.` : result.message);
    setConfirm(null);
  };

  return (
    <PageShell
      role="system_admin"
      title="Pending Registrations"
      description="Review non-staff sign-ups. Only active accounts can log in."
    >
      {flash ? (
        <div className="mb-4 rounded-xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-2.5 text-sm text-emerald-700">
          {flash}
        </div>
      ) : null}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, email or phone…"
        selects={[
          {
            id: "reg-status",
            label: "Status",
            value: status,
            onChange: setStatus,
            options: [
              { value: "pending", label: "Pending" },
              { value: "rejected", label: "Rejected" },
              { value: "active", label: "Active learners" },
              { value: "all", label: "Pending & rejected" },
            ],
          },
        ]}
        onClear={() => {
          setSearch("");
          setStatus("pending");
        }}
        hasActiveFilters={search !== "" || status !== "pending"}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No registrations found"
          description="New public sign-ups appear here with status Pending."
        />
      ) : (
        <Table columns={["Name", "Email", "Phone", "Registration date", "Status", "Actions"]}>
          {rows.map((user) => (
            <tr key={user.id}>
              <Td>
                <span className="font-medium text-slate-900">{user.name}</span>
                <span className="block text-[11px] text-slate-400">{user.department}</span>
              </Td>
              <Td>{user.email}</Td>
              <Td>{user.phone || "—"}</Td>
              <Td className="whitespace-nowrap">{user.createdAt}</Td>
              <Td>
                <UserStatusBadge status={user.status} />
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setViewUser(user)}>
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                  {user.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => setConfirm({ id: user.id, action: "approve" })}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setConfirm({ id: user.id, action: "reject" })}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </>
                  ) : null}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}

      <Modal
        open={viewUser !== null}
        onClose={() => setViewUser(null)}
        title={viewUser?.name ?? "Registration"}
        subtitle={viewUser?.email}
      >
        {viewUser ? (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-slate-400">Phone</dt>
              <dd>{viewUser.phone}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Department</dt>
              <dd>{viewUser.department}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Registered</dt>
              <dd>{viewUser.createdAt}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Status</dt>
              <dd>
                <UserStatusBadge status={viewUser.status} />
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      <Modal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm?.action === "approve" ? "Approve registration?" : "Reject registration?"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant={confirm?.action === "reject" ? "danger" : "success"}
              onClick={runAction}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          {confirm?.action === "approve"
            ? "The user will be able to sign in as a learner."
            : "The user will not be able to sign in."}
        </p>
      </Modal>
    </PageShell>
  );
}
