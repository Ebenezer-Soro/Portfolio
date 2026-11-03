import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Bandeau d'appel, juste avant le pied de page.
 *
 * C'est le seul endroit de la page où la couleur occupe toute la
 * surface — donc le seul qui puisse conclure. Partout ailleurs
 * l'accent se limite à un filet, une pastille ou un bouton.
 */
export function CtaBanner({ email }: { email?: string | null }) {
  return (
    <section className="relative z-0">
      <div className="piste-animee mx-auto w-full max-w-[1320px] px-[clamp(1.25rem,0.9rem+1.6vw,2.5rem)] pb-[var(--space-16)]">
        <div className="bandeau-appel p-[clamp(2.25rem,1.5rem+3vw,4.5rem)]">
          <div className="trame trame-fine" aria-hidden />
          <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] font-bold leading-[1.12]">
                Un projet à construire ?
              </h2>
              <p className="mt-3.5 max-w-xl text-[17px] leading-[1.65] opacity-85">
                Dites-moi le problème avant la solution. Je reviens vers vous avec un périmètre,
                un délai et un avis honnête sur ce qui est réaliste.
              </p>
            </div>
            <Link href={email ? `mailto:${email}` : "/contact"}>
              <Button
                size="lg"
                className="border-0 bg-white text-[var(--bleu-700)] shadow-[0_12px_30px_-12px_rgb(0_0_0/0.45)] hover:bg-[var(--bleu-100)] dark:bg-[var(--nuit-950)] dark:text-white"
              >
                Écrivez-moi
                <span className="rond" aria-hidden>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
