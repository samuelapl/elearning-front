import type { AuditLog } from "@/types";

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: "al1", actor: "Abebe Kebede", action: "submitted course for approval", target: "Customs Declaration Procedures", timestamp: "2026-09-08 09:12" },
  { id: "al2", actor: "Tigist Alemu", action: "approved course", target: "VAT Registration & Compliance", timestamp: "2026-08-30 15:40" },
  { id: "al3", actor: "Hailemariam Dessalegn", action: "published course", target: "Income Tax Basics for SMEs", timestamp: "2026-08-28 11:05" },
  { id: "al4", actor: "Hailemariam Dessalegn", action: "enrolled 4 learners", target: "eServices Portal User Training", timestamp: "2026-08-27 10:22" },
  { id: "al5", actor: "Daniel Bekele", action: "created quiz", target: "VAT Fundamentals Quiz", timestamp: "2026-08-25 14:10" },
  { id: "al6", actor: "Daniel Bekele", action: "scheduled live session", target: "VAT Compliance Live Q&A", timestamp: "2026-08-24 09:00" },
  { id: "al7", actor: "Yonas Girma", action: "changed role of", target: "Dawit Haile → Learner", timestamp: "2026-08-22 16:35" },
  { id: "al8", actor: "Abebe Kebede", action: "created course", target: "Withholding Tax Essentials", timestamp: "2026-08-20 13:18" },
  { id: "al9", actor: "Tigist Alemu", action: "approved course", target: "Import Duty & Tariff Classification", timestamp: "2026-08-18 10:02" },
  { id: "al10", actor: "Hailemariam Dessalegn", action: "published course", target: "Tax Audit Procedures", timestamp: "2026-08-15 12:44" },
];