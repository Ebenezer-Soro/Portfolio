"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./Reveal";
import { SectionDecor } from "./SectionDecor";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import type { Profile } from "@prisma/client";

export function ContactSection({ profile }: { profile: Profile }) {
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
    profile.email && { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: Phone, label: "Téléphone", value: profile.phone, href: `tel:${profile.phone}` },
    profile.location && { icon: MapPin, label: "Localisation", value: profile.location, href: undefined },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="section-pad relative overflow-hidden bg-[var(--bg-secondary)]">
      <SectionDecor variant="primary" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Contact"
          title="Travaillons ensemble"
          description="Un projet en tête ? Parlons-en."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Infos */}
          <div className="space-y-6">
            <p className="text-lg text-[var(--text-secondary)]">
              N’hésitez pas à me contacter pour toute demande de collaboration, devis ou simple
              question. Je réponds sous 24-48h.
            </p>
            <ul className="space-y-4">
              {infos.map((info) => (
                <li key={info.label} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                    <info.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="font-medium text-[var(--text-primary)] hover:text-primary"
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
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="card-surface space-y-4 p-6"
            noValidate
          >
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
              rows={5}
              error={errors.message?.message}
              {...register("message")}
            />
            <Button type="submit" variant="gradient" size="lg" loading={isSubmitting} className="w-full">
              Envoyer le message <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
