"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Switch } from "@/components/admin/Switch";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
} from "@/lib/actions/testimonials";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@prisma/client";
import type { TestimonialFormData } from "@/lib/validations";

type Draft = TestimonialFormData & { id?: string };

const empty: Draft = {
  name: "",
  role: "",
  company: "",
  content: "",
  avatarUrl: null,
  rating: 5,
  published: false,
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-4 w-4",
            n <= rating ? "fill-warning text-warning" : "text-[var(--border)]",
          )}
        />
      ))}
    </span>
  );
}

export function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [toDelete, setToDelete] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const payload: TestimonialFormData = {
        name: draft.name,
        role: draft.role,
        company: draft.company || null,
        content: draft.content,
        avatarUrl: draft.avatarUrl || null,
        rating: Number(draft.rating),
        published: draft.published,
      };
      if (draft.id) {
        const updated = await updateTestimonial(draft.id, payload);
        setItems((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await createTestimonial(payload);
        setItems((s) => [created, ...s]);
      }
      toast.success("Témoignage enregistré");
      setDraft(null);
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (t: Testimonial) => {
    try {
      const updated = await toggleTestimonialPublished(t.id);
      setItems((s) => s.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      toast.error("Erreur");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTestimonial(toDelete.id);
      setItems((s) => s.filter((x) => x.id !== toDelete.id));
      toast.success("Témoignage supprimé");
      setToDelete(null);
    } catch {
      toast.error("Erreur");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setDraft({ ...empty })}>
          <Plus className="h-4 w-4" /> Ajouter un témoignage
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="card-surface p-8 text-center text-[var(--text-muted)]">
          Aucun témoignage. Ajoutez-en un.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => (
            <li
              key={t.id}
              className="card-surface flex items-center gap-4 p-4"
            >
              <Avatar src={t.avatarUrl} alt={t.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--text-primary)]">{t.name}</p>
                <p className="truncate text-sm text-[var(--text-muted)]">
                  {[t.role, t.company].filter(Boolean).join(" · ")}
                </p>
              </div>
              <Stars rating={t.rating} />
              <Switch
                id={`pub-${t.id}`}
                checked={t.published}
                onCheckedChange={() => togglePublished(t)}
              />
              <button
                onClick={() =>
                  setDraft({
                    id: t.id,
                    name: t.name,
                    role: t.role,
                    company: t.company ?? "",
                    content: t.content,
                    avatarUrl: t.avatarUrl,
                    rating: t.rating,
                    published: t.published,
                  })
                }
                className="text-[var(--text-muted)] hover:text-primary"
                aria-label="Éditer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setToDelete(t)}
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
        title={draft?.id ? "Modifier le témoignage" : "Nouveau témoignage"}
      >
        {draft && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nom"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
              <Input
                label="Rôle"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </div>
            <Input
              label="Entreprise"
              value={draft.company ?? ""}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
            />
            <Textarea
              label="Témoignage"
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              rows={4}
            />
            <ImageUploader
              label="Avatar"
              accept="image"
              value={draft.avatarUrl}
              onChange={(url) => setDraft({ ...draft, avatarUrl: url })}
            />
            <Select
              label="Note"
              value={draft.rating}
              onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} étoile{n > 1 ? "s" : ""}
                </option>
              ))}
            </Select>
            <div className="rounded-lg border border-[var(--border)] p-4">
              <Switch
                id="testimonial-published"
                checked={draft.published}
                onCheckedChange={(v) => setDraft({ ...draft, published: v })}
                label="Publié"
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
        description={`Supprimer le témoignage de « ${toDelete?.name} » ?`}
      />
    </>
  );
}
