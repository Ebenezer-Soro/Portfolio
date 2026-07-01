"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Switch } from "@/components/admin/Switch";
import { formatDate } from "@/lib/utils";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/actions/experiences";
import type { Experience } from "@prisma/client";

type ExperienceFormData = {
  type: "work" | "education";
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  order: number;
};

type Draft = ExperienceFormData & { id?: string };

const empty: Draft = {
  type: "work",
  title: "",
  organization: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  order: 0,
};

function toDateInput(date: Date | null): string {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

export function ExperiencesManager({ initial }: { initial: Experience[] }) {
  const [experiences, setExperiences] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [toDelete, setToDelete] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = (exp: Experience) => {
    setDraft({
      id: exp.id,
      type: exp.type === "education" ? "education" : "work",
      title: exp.title,
      organization: exp.organization,
      location: exp.location ?? "",
      startDate: toDateInput(exp.startDate),
      endDate: toDateInput(exp.endDate),
      current: exp.current,
      description: exp.description ?? "",
      order: exp.order,
    });
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const payload = {
        type: draft.type,
        title: draft.title,
        organization: draft.organization,
        location: draft.location || undefined,
        startDate: draft.startDate,
        endDate: draft.endDate || undefined,
        current: draft.current,
        description: draft.description || undefined,
        order: Number(draft.order),
      };
      if (draft.id) {
        const updated = await updateExperience(draft.id, payload);
        setExperiences((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await createExperience(payload);
        setExperiences((s) => [...s, created]);
      }
      toast.success("Expérience enregistrée");
      setDraft(null);
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteExperience(toDelete.id);
      setExperiences((s) => s.filter((x) => x.id !== toDelete.id));
      toast.success("Expérience supprimée");
      setToDelete(null);
    } catch {
      toast.error("Erreur");
    } finally {
      setDeleting(false);
    }
  };

  const dateRange = (exp: Experience) => {
    const start = formatDate(exp.startDate, "MMM yyyy");
    const end = exp.current ? "Présent" : exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "—";
    return `${start} – ${end}`;
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setDraft({ ...empty })}>
          <Plus className="h-4 w-4" /> Ajouter une expérience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <p className="card-surface p-8 text-center text-[var(--text-muted)]">
          Aucune expérience. Ajoutez-en une.
        </p>
      ) : (
        <ul className="space-y-3">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="card-surface flex items-center gap-4 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-primary)]">{exp.title}</span>
                  <Badge variant={exp.type === "education" ? "accent" : "default"}>
                    {exp.type === "education" ? "Formation" : "Travail"}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{exp.organization}</p>
                <p className="text-xs text-[var(--text-muted)]">{dateRange(exp)}</p>
              </div>
              <button
                onClick={() => startEdit(exp)}
                className="text-[var(--text-muted)] hover:text-primary"
                aria-label="Éditer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setToDelete(exp)}
                className="text-[var(--text-muted)] hover:text-danger"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!draft}
        onOpenChange={(o) => !o && setDraft(null)}
        title={draft?.id ? "Modifier l'expérience" : "Nouvelle expérience"}
      >
        {draft && (
          <div className="space-y-4">
            <Select
              label="Type"
              value={draft.type}
              onChange={(e) =>
                setDraft({ ...draft, type: e.target.value as "work" | "education" })
              }
            >
              <option value="work">Travail</option>
              <option value="education">Formation</option>
            </Select>
            <Input
              label="Titre"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <Input
              label="Organisation"
              value={draft.organization}
              onChange={(e) => setDraft({ ...draft, organization: e.target.value })}
            />
            <Input
              label="Lieu"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date de début"
                type="date"
                value={draft.startDate}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
              />
              <Input
                label="Date de fin"
                type="date"
                value={draft.endDate}
                onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                disabled={draft.current}
              />
            </div>
            <Switch
              checked={draft.current}
              onCheckedChange={(v) => setDraft({ ...draft, current: v })}
              label="En cours"
            />
            <Textarea
              label="Description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
            <Input
              label="Ordre"
              type="number"
              value={draft.order}
              onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setDraft(null)}>
                Annuler
              </Button>
              <Button loading={saving} onClick={save}>
                Enregistrer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={deleting}
        onConfirm={confirmDelete}
        description={`Supprimer « ${toDelete?.title} » ?`}
      />
    </>
  );
}
