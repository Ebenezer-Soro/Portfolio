import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// POST /api/track — tracking anonyme des visites (aucune auth requise).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path: string = typeof body.path === "string" ? body.path : "/";
    const referrer: string | null =
      typeof body.referrer === "string" && body.referrer ? body.referrer : null;

    const userAgent = req.headers.get("user-agent");
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;
    const country = req.headers.get("x-vercel-ip-country");
    const city = req.headers.get("x-vercel-ip-city");

    await prisma.visit.create({
      data: { path, referrer, userAgent, ip, country, city },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Le tracking ne doit jamais casser l'expérience utilisateur.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
