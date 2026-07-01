import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export const runtime = "nodejs";

// POST /api/contact — enregistre un message de contact.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", issues: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const { name, email, subject, message } = parsed.data;
    await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
