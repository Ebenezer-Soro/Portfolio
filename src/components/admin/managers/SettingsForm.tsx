"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/admin/Switch";
import { updateSettings } from "@/lib/actions/settings";
import { SECTIONS_MASQUABLES, cleVisibilite } from "@/lib/sections";

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

  // Une clé absente vaut « visible » : activer la fonctionnalité ne masque
  // rien de ce qui était déjà en ligne.
  const [visibles, setVisibles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      SECTIONS_MASQUABLES.map((s) => [s.id, settings[cleVisibilite(s.id)] !== "false"]),
    ),
  );

  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const nbMasquees = SECTIONS_MASQUABLES.filter((s) => !visibles[s.id]).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        site_name: String(form.site_name),
        stats_projects: String(form.stats_projects),
        stats_years: String(form.stats_years),
        stats_techs: String(form.stats_techs),
        ...Object.fromEntries(
          SECTIONS_MASQUABLES.map((s) => [cleVisibilite(s.id), String(visibles[s.id])]),
        ),
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
      <div className="min-w-0 space-y-6 lg:col-span-2">
        <div className="card-surface space-y-5 p-4 sm:p-6">
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

        <div className="card-surface p-4 sm:p-6">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Sections de l&apos;accueil
            </h2>
            {nbMasquees > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {nbMasquees} masquée{nbMasquees > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="mb-5 text-sm text-[var(--text-secondary)]">
            Masquer une section la retire de la page d&apos;accueil sans supprimer son
            contenu. Vous pourrez la réafficher à tout moment. L&apos;en-tête et le pied de
            page restent toujours visibles.
          </p>

          <ul className="divide-y divide-[var(--border)]">
            {SECTIONS_MASQUABLES.map((s) => {
              const actif = visibles[s.id];
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={
                        actif
                          ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                          : "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                      }
                    >
                      {actif ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {s.label}
                      </p>
                      <p className="truncate text-xs text-[var(--text-muted)]">{s.aide}</p>
                    </div>
                  </div>
                  <Switch
                    checked={actif}
                    onCheckedChange={(v) =>
                      setVisibles((prev) => ({ ...prev, [s.id]: v }))
                    }
                    aria-label={`Afficher la section ${s.label}`}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <Button type="submit" variant="primary" size="lg" loading={saving} className="w-full">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
