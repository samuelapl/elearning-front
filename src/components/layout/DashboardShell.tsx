"use client";

import type { ReactNode } from "react";
import { LmsProvider } from "@/lib/lms-store";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <LmsProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </LmsProvider>
  );
}