import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ipDe, limiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

// POST /api/track — tracking anonyme des visites (aucune auth requise).
export async function POST(req: NextRequest) {
  // 60 vues par heure et par IP : au-delà, c'est de l'automatisation, pas un
  // visiteur. On répond 200 pour ne pas signaler la limite à un robot.
  if (!limiter(`track:${ipDe(req)}`, 60, 3_600_000).autorise) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await req.json().catch(() => ({}));
    // Le chemin est borné et doit ressembler à une route : sans contrôle,
    // n'importe quelle chaîne se retrouve stockée puis affichée dans l'admin.
    const brut = typeof body.path === "string" ? body.path : "/";
    const path = /^\/[\w\-/[\]().]{0,200}$/.test(brut) ? brut : "/";
    const referrer: string | null =
      typeof body.referrer === "string" && body.referrer
        ? body.referrer.slice(0, 300)
        : null;

    const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;
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
