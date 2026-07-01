import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";
import type { VisitByDay, TopPage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/analytics — statistiques de visites (protégé).
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    const [totalVisits, todayVisits, weekVisits, unreadMessages, visitsByDay, topPages] =
      await Promise.all([
        prisma.visit.count(),
        prisma.visit.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.visit.count({ where: { createdAt: { gte: startOfWeek } } }),
        prisma.contactMessage.count({ where: { read: false } }),
        prisma.$queryRaw<VisitByDay[]>`
          SELECT TO_CHAR(DATE("createdAt"), 'YYYY-MM-DD') as date, COUNT(*)::int as count
          FROM "Visit"
          WHERE "createdAt" >= NOW() - INTERVAL '30 days'
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
        `,
        prisma.$queryRaw<TopPage[]>`
          SELECT path, COUNT(*)::int as count
          FROM "Visit"
          GROUP BY path
          ORDER BY count DESC
          LIMIT 5
        `,
      ]);

    return NextResponse.json({
      totalVisits,
      todayVisits,
      weekVisits,
      unreadMessages,
      visitsByDay,
      topPages,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
