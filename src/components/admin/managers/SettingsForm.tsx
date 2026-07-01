"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateSettings } from "@/lib/actions/settings";

const DEFAULTS: Record<string, string> = {
  site_name: "Soro Z. Ebenezer",
  stats_projects: "15",
  stats_years: "3",
  stats_techs: "20",
};

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [form, setForm] = useState({
    site_name: settings.site_name ?? DEFAULTS.site_name,
    stats_projects: settings.stats_projects ?? DEFAULTS.stats_projects,
    stats_years: settings.stats_years ?? DEFAULTS.stats_years,
    stats_techs: settings.stats_techs ?? DEFAULTS.stats_techs,
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        site_name: String(form.site_name),
        stats_projects: String(form.stats_projects),
        stats_years: String(form.stats_years),
        stats_techs: String(form.stats_techs),
      });
      toast.success("Paramètres enregistrés");
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
          Général
        </h2>
        <Input
          label="Nom du site"
          value={form.site_name}
          onChange={(e) => set("site_name", e.target.value)}
        />

        <h2 className="pt-2 font-display text-lg font-semibold text-[var(--text-primary)]">
          Statistiques
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Projets"
            type="number"
            value={form.stats_projects}
            onChange={(e) => set("stats_projects", e.target.value)}
          />
          <Input
            label="Années d'expérience"
            type="number"
            value={form.stats_years}
            onChange={(e) => set("stats_years", e.target.value)}
          />
          <Input
            label="Technologies"
            type="number"
            value={form.stats_techs}
            onChange={(e) => set("stats_techs", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        <Button type="submit" variant="gradient" size="lg" loading={saving} className="w-full">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
