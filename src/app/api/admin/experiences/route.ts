import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const data = await prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }, { order: "asc" }],
  });
  return NextResponse.json(data);
}
