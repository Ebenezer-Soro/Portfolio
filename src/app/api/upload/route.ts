import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

// POST /api/upload — upload protégé (session admin requise).
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("file").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const results = [];
    for (const file of files) {
      const saved = await saveUpload(file);
      const media = await prisma.media.create({
        data: {
          filename: file.name,
          url: saved.url,
          type: saved.type,
          size: saved.size,
          alt: file.name,
        },
      });
      results.push(media);
    }

    // Compat : un seul fichier → renvoie aussi url à la racine.
    return NextResponse.json({
      ok: true,
      media: results,
      url: results[0]?.url,
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Erreur d'upload" },
      { status: 400 },
    );
  }
}
