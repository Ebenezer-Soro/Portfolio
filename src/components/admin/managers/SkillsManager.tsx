"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createSkill, updateSkill, deleteSkill } from "@/lib/actions/skills";
import type { Skill } from "@prisma/client";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Sécurité", "IA", "Autre"];

type Draft = {
  id?: string;
  name: string;
  level: number;
  category: string;
  iconUrl: string | null;
  order: number;
};

const empty: Draft = { name: "", level: 80, category: "Frontend", iconUrl: null, order: 0 };

export function SkillsManager({ initial }: { initial: Skill[] }) {
  const [skills, setSkills] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [toDelete, setToDelete] = useState<Skill | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const payload = {
        name: draft.name,
        level: Number(draft.level),
        category: draft.category,
        iconUrl: draft.iconUrl,
        order: Number(draft.order),
      };
      if (draft.id) {
        const updated = await updateSkill(draft.id, payload);
        setSkills((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await createSkill(payload);
        setSkills((s) => [...s, created]);
      }
      toast.success("Compétence enregistrée");
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
      await deleteSkill(toDelete.id);
      setSkills((s) => s.filter((x) => x.id !== toDelete.id));
      toast.success("Compétence supprimée");
      setToDelete(null);
    } catch {
      toast.error("Erreur");
    } finally {
      setDeleting(false);
    }
  };

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setDraft({ ...empty })}>
          <Plus className="h-4 w-4" /> Ajouter une compétence
        </Button>
      </div>

      {byCategory.length === 0 ? (
        <p className="card-surface p-8 text-center text-[var(--text-muted)]">
          Aucune compétence. Ajoutez-en une.
        </p>
      ) : (
        <div className="space-y-6">
          {byCategory.map((group) => (
            <div key={group.cat} className="card-surface p-5">
              <h3 className="mb-4 font-display font-semibold text-primary">{group.cat}</h3>
              <ul className="space-y-2">
                {group.items.map((skill) => (
                  <li
                    key={skill.id}
                    className="flex items-center gap-4 rounded-lg border border-[var(--border)] p-3"
                  >
                    <span className="flex-1 font-medium text-[var(--text-primary)]">{skill.name}</span>
                    <div className="hidden h-2 w-40 overflow-hidden rounded-full bg-[var(--bg-secondary)] sm:block">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${skill.level}%` }} />
                    </div>
                    <span className="w-10 text-right text-sm text-[var(--text-muted)]">{skill.level}%</span>
                    <button onClick={() => setDraft({ ...skill, iconUrl: skill.iconUrl })} className="text-[var(--text-muted)] hover:text-primary" aria-label="Éditer">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setToDelete(skill)} className="text-[var(--text-muted)] hover:text-danger" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!draft}
        onOpenChange={(o) => !o && setDraft(null)}
        title={draft?.id ? "Modifier la compétence" : "Nouvelle compétence"}
      >
        {draft && (
          <div className="space-y-4">
            <Input label="Nom" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <Select label="Catégorie" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                Niveau : {draft.level}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={draft.level}
                onChange={(e) => setDraft({ ...draft, level: Number(e.target.value) })}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>
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
        description={`Supprimer « ${toDelete?.name} » ?`}
      />
    </>
  );
}
