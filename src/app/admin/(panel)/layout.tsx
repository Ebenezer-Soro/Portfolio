import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  let unreadCount = 0;
  try {
    unreadCount = await prisma.contactMessage.count({ where: { read: false } });
  } catch {
    unreadCount = 0;
  }

  return (
    <AdminLayout unreadCount={unreadCount} userName={session.user.name}>
      {children}
    </AdminLayout>
  );
}
