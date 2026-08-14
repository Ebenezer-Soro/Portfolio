"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "./SectionShell";
import { slideIn } from "@/lib/motion";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import type { Profile } from "@prisma/client";

export function ContactSection({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

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
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile.phone && {
      icon: Phone,
      label: "Téléphone",
      value: profile.phone,
      href: `tel:${profile.phone}`,
    },
    profile.location && {
      icon: MapPin,
      label: "Localisation",
      value: profile.location,
      href: undefined,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    // Fond transparent : l'appelant fournit la surface (et, sur l'accueil,
    // le champ d'étoiles qui doit rester visible derrière la section).
    <SectionShell id="contact" className="bg-transparent">
      {/* Disposition du modèle : le panneau de formulaire glisse depuis la
          gauche, le bloc d'informations depuis la droite. En dessous de xl,
          `flex-col-reverse` remonte le formulaire au-dessus des coordonnées. */}
      <div className="flex flex-col-reverse gap-10 overflow-hidden xl:flex-row">
        <motion.div
          variants={reduce ? undefined : slideIn("left", "tween", 0.2, 1)}
          className="rounded-2xl bg-[var(--surface-raised)] p-8 shadow-card xl:flex-[0.75]"
        >
          <p className="section-sub-text">Restons en contact</p>
          <h2 className="section-head-text mt-2 text-[var(--text-primary)]">Contact.</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nom"
                placeholder="Votre nom"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Email"
                type="email"
                placeholder="vous@exemple.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
            <Input
              label="Sujet"
              placeholder="Objet de votre message"
              error={errors.subject?.message}
              {...register("subject")}
            />
            <Textarea
              label="Message"
              placeholder="Décrivez votre projet…"
              rows={6}
              error={errors.message?.message}
              {...register("message")}
            />
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              Envoyer le message <Send className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : slideIn("right", "tween", 0.2, 1)}
          className="flex flex-col justify-center gap-8 xl:flex-1"
        >
          <p className="max-w-md text-[17px] leading-[30px] text-[var(--text-secondary)]">
            Un projet en tête ? Une question ? Écrivez-moi : je réponds sous 24 à 48 heures,
            que ce soit pour une collaboration, un devis ou un simple échange.
          </p>

          <ul className="space-y-4">
            {infos.map((info) => (
              <li key={info.label} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent2 text-white shadow-[var(--shadow-sky)]">
                  <info.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    {info.label}
                  </p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="font-medium text-[var(--text-primary)] transition-colors hover:text-primary [overflow-wrap:anywhere]"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="font-medium text-[var(--text-primary)]">{info.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </SectionShell>
  );
}
