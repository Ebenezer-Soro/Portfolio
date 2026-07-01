"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { cn } from "@/lib/utils";
import type { FAQ } from "@prisma/client";

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  if (!faqs.length) return null;

  return (
    <section id="faq" className="section-pad relative overflow-hidden bg-[var(--bg-primary)]">
      <SectionDecor variant="accent" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions fréquentes"
          description="Tout ce que vous devez savoir avant de collaborer."
        />

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => {
            const isOpen = open === faq.id;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display font-semibold text-[var(--text-primary)]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-primary transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
