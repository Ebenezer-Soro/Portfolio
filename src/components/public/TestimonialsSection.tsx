"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeading } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import type { Testimonial } from "@prisma/client";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % testimonials.length),
    [testimonials.length],
  );
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [paused, next, testimonials.length]);

  if (!testimonials.length) return null;
  const t = testimonials[index];

  return (
    <section id="testimonials" className="section-pad relative overflow-hidden bg-[var(--bg-secondary)]">
      <SectionDecor variant="primary" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Témoignages"
          title="Ils me font confiance"
          description="Ce que mes clients disent de notre collaboration."
        />

        <div
          className="relative mx-auto max-w-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="card-surface p-6 text-center sm:p-8"
              >
                <Quote className="mx-auto mb-4 h-8 w-8 text-primary/40" />
                <p className="text-lg italic leading-relaxed text-[var(--text-primary)]">
                  “{t.content}”
                </p>
                <div className="mt-5 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < t.rating
                          ? "h-4 w-4 fill-warning text-warning"
                          : "h-4 w-4 text-[var(--text-muted)]"
                      }
                    />
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <Avatar src={t.avatarUrl} alt={t.name} className="h-12 w-12" />
                  <div className="text-left">
                    <p className="font-display font-semibold text-[var(--text-primary)]">
                      {t.name}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                aria-label="Précédent"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:text-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Témoignage ${i + 1}`}
                    className={
                      i === index
                        ? "h-2 w-6 rounded-full bg-primary transition-all"
                        : "h-2 w-2 rounded-full bg-[var(--border)] transition-all"
                    }
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label="Suivant"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:text-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
