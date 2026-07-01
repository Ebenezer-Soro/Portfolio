import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialsManager } from "@/components/admin/managers/TestimonialsManager";
import type { Testimonial } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function TemoignagesPage() {
  let testimonials: Testimonial[] = [];
  try {
    testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    testimonials = [];
  }

  return (
    <>
      <PageHeader title="Témoignages" description="Gérez les avis de vos clients et collaborateurs" />
      <TestimonialsManager initial={testimonials} />
    </>
  );
}
