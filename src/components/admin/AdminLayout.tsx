"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout({
  children,
  unreadCount,
  userName,
}: {
  children: React.ReactNode;
  unreadCount: number;
  userName?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Sidebar unreadCount={unreadCount} open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenu={() => setOpen(true)} userName={userName} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
