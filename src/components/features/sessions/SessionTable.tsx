import type { ReactNode } from "react";
import type { LiveSession } from "@/types";
import { Table, TableRow, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { TODAY } from "@/data/mock";

export interface SessionRow {
  session: LiveSession;
  courseTitle: string;
  courseCode: string;
  trainerName: string;
}

interface SessionTableProps {
  sessions: SessionRow[];
  extra?: (row: SessionRow) => ReactNode;
}

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function SessionTable({ sessions, extra }: SessionTableProps) {
  const sorted = [...sessions].sort((a, b) => a.session.date.localeCompare(b.session.date));

  return (
    <Table columns={["Date", "Time", "Session", "Course", "Trainer", "", ""]}>
      {sorted.length === 0 ? (
        <tr>
          <Td colSpan={7} className="py-10 text-center text-xs text-slate-400">
            No sessions scheduled.
          </Td>
        </tr>
      ) : (
        sorted.map((row) => {
          const isUpcoming = row.session.date >= TODAY;
          const attended = row.session.attendees.filter((a) => a.attended).length;
          return (
            <TableRow key={row.session.id}>
              <Td className="whitespace-nowrap font-medium text-slate-900">
                {formatDate(row.session.date)}
              </Td>
              <Td className="whitespace-nowrap">{row.session.time}</Td>
              <Td>
                <span className="font-medium text-slate-900">{row.session.title}</span>
                <span className="block text-[11px] text-slate-400">
                  {row.session.durationMin} minutes
                </span>
              </Td>
              <Td>
                <span className="text-slate-700">{row.courseTitle}</span>
                <span className="block text-[11px] text-slate-400">{row.courseCode}</span>
              </Td>
              <Td className="whitespace-nowrap">{row.trainerName}</Td>
              <Td>
                <Badge variant={isUpcoming ? "blue" : "slate"} dot>
                  {isUpcoming ? "Upcoming" : "Past"} · {attended} present
                </Badge>
              </Td>
              <Td className="text-right">{extra ? extra(row) : null}</Td>
            </TableRow>
          );
        })
      )}
    </Table>
  );
}