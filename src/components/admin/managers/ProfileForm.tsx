"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/admin/Switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@prisma/client";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    photoUrl: profile.photoUrl,
    aboutPhotoUrl: profile.aboutPhotoUrl,
    logoUrl: profile.logoUrl,
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    cvUrl: profile.cvUrl,
    isAvailable: profile.isAvailable,
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profil mis à jour");
    } catch (err) {
      toast.error((err as Error).message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="card-surface space-y-5 p-6 lg:col-span-2">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
          Informations personnelles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nom" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          <Input label="Titre" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>
        <Textarea label="Bio" value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={5} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <Input label="Téléphone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <Input label="Localisation" value={form.location} onChange={(e) => set("location", e.target.value)} />

        <div className="rounded-lg border border-[var(--border)] p-4">
          <Switch
            id="available"
            checked={form.isAvailable}
            onCheckedChange={(v) => set("isAvailable", v)}
            label="Disponible pour de nouveaux projets"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-surface space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Médias</h2>
          <ImageUploader
            label="Photo du Hero (idéalement détourée, fond transparent)"
            value={form.photoUrl}
            onChange={(url) => set("photoUrl", url)}
          />
          <ImageUploader
            label="Photo section « À propos » (optionnelle)"
            value={form.aboutPhotoUrl}
            onChange={(url) => set("aboutPhotoUrl", url)}
          />
          <p className="-mt-2 text-xs text-[var(--text-muted)]">
            Si vide, la photo du Hero sera réutilisée dans la section « À propos ».
          </p>
          <ImageUploader label="Logo" value={form.logoUrl} onChange={(url) => set("logoUrl", url)} />
          <ImageUploader label="CV (PDF)" accept="pdf" value={form.cvUrl} onChange={(url) => set("cvUrl", url)} />
          <Input
            label="Ou lien CV externe"
            value={form.cvUrl ?? ""}
            onChange={(e) => set("cvUrl", e.target.value || null)}
            placeholder="https://…"
          />
        </div>

        <Button type="submit" variant="gradient" size="lg" loading={saving} className="w-full">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
