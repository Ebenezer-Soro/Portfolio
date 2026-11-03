"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Globe, Mail, MapPin, Phone, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./Reveal";
import { SectionShell } from "./SectionShell";
import { NodeNetwork } from "@/components/canvas/NodeNetwork";
import { fadeIn } from "@/lib/motion";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import type { Profile } from "@prisma/client";

/**
 * Contact — coordonnées et formulaire dans un SEUL panneau.
 *
 * Deux cartes côte à côte donnaient l'impression de deux sujets
 * distincts, alors qu'il n'y en a qu'un : prendre contact. Un filet
 * les sépare, la colonne de gauche est posée sur une surface creuse.
 */
export function ContactSection({ profile, index }: { profile: Profile; index?: string }) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Message envoyé ! Je vous répondrai rapidement.");
      reset();
    } catch {
      toast.error("Une erreur est survenue. Réessayez.");
    }
  };

  const infos = [
    profile.email && {
      icon: Mail,
      label: "E-mail",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile.phone && {
      icon: Phone,
      label: "Téléphone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
    },
    profile.location && {
      icon: MapPin,
      label: "Localisation",
      value: profile.location,
      href: undefined,
    },
    {
      icon: Globe,
      label: "Disponibilité",
      value: "Freelance · à distance",
      href: undefined,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <SectionShell id="contact" className="overflow-hidden">
      <NodeNetwork />

      <SectionHeading
        index={index ?? "11"}
        eyebrow="Contact"
        title="Dites-moi ce que vous construisez."
        description="Un projet, une question, ou un second avis sur ce que vous avez déjà — je réponds sous 24 à 48 heures."
        align="left"
      />

      <motion.div
        variants={fadeIn("up", "tween", 0.1, 0.8)}
        className="relative grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[image:var(--nappe)] shadow-card lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
      >
        <div className="border-b border-[var(--border)] bg-[var(--surface-deep)] p-[clamp(1.75rem,1.2rem+1.6vw,3rem)] lg:border-b-0 lg:border-r">
          <p className="mono-label">Me joindre directement</p>

          <ul className="mt-4">
            {infos.map((info, i) => (
              <li
                key={info.label}
                className={`flex items-center gap-4 py-4 ${i > 0 ? "border-t border-[var(--border)]" : ""}`}
              >
                <span className="ecusson h-11 w-11">
                  <info.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="mono-label text-[10px]">{info.label}</span>
                  <br />
                  {info.href ? (
                    <a
                      href={info.href}
                      className="font-semibold tracking-[-0.01em] text-[var(--text-primary)] transition-colors hover:text-primary [overflow-wrap:anywhere]"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <span className="font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                      {info.value}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-[clamp(1.75rem,1.2rem+1.6vw,3rem)]">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1.125rem]" noValidate>
            <div className="grid gap-[1.125rem] sm:grid-cols-2">
              <Input label="Nom" placeholder="Votre nom" error={errors.name?.message} {...register("name")} />
              <Input
                label="E-mail"
                type="email"
                placeholder="vous@exemple.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
            <Input
              label="Sujet"
              placeholder="De quoi s'agit-il ?"
              error={errors.subject?.message}
              {...register("subject")}
            />
            <Textarea
              label="Message"
              placeholder="Décrivez votre projet, vos contraintes et votre échéance."
              rows={6}
              error={errors.message?.message}
              {...register("message")}
            />
            <Button type="submit" variant="primary" size="lg" loading={isSubmitting}>
              Envoyer le message
              <span className="rond" aria-hidden>
                <Send className="h-4 w-4" />
              </span>
            </Button>
          </form>
        </div>
      </motion.div>
    </SectionShell>
  );
}
