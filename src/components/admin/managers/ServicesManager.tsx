"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Switch } from "@/components/admin/Switch";
import {
  createService,
  updateService,
  deleteService,
  toggleServicePublished,
} from "@/lib/actions/services";
import type { Service } from "@prisma/client";

type ServiceFormData = {
  title: string;
  description: string;
  iconName: string;
  order: number;
  published: boolean;
};

type Draft = ServiceFormData & { id?: string };

const empty: Draft = {
  title: "",
  description: "",
  iconName: "Sparkles",
  order: 0,
  published: true,
};

export function ServicesManager({ initial }: { initial: Service[] }) {
  const [services, setServices] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = (service: Service) => {
    setDraft({
      id: service.id,
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      order: service.order,
      published: service.published,
    });
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const payload = {
        title: draft.title,
        description: draft.description,
        iconName: draft.iconName,
        order: Number(draft.order),
        published: draft.published,
      };
      if (draft.id) {
        const updated = await updateService(draft.id, payload);
        setServices((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await createService(payload);
        setServices((s) => [...s, created]);
      }
      toast.success("Service enregistré");
      setDraft(null);
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (service: Service) => {
    try {
      const updated = await toggleServicePublished(service.id);
      setServices((s) => s.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      toast.error("Erreur");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteService(toDelete.id);
      setServices((s) => s.filter((x) => x.id !== toDelete.id));
      toast.success("Service supprimé");
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
          <Plus className="h-4 w-4" /> Ajouter un service
        </Button>
      </div>

      {services.length === 0 ? (
        <p className="card-surface p-8 text-center text-[var(--text-muted)]">
          Aucun service. Ajoutez-en un.
        </p>
      ) : (
        <ul className="space-y-3">
          {services.map((service) => (
            <li key={service.id} className="card-surface flex items-center gap-4 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name={service.iconName} className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <span className="font-medium text-[var(--text-primary)]">{service.title}</span>
                <p className="line-clamp-1 text-sm text-[var(--text-secondary)]">
                  {service.description}
                </p>
              </div>
              <Switch
                checked={service.published}
                onCheckedChange={() => togglePublished(service)}
              />
              <button
                onClick={() => startEdit(service)}
                className="text-[var(--text-muted)] hover:text-primary"
                aria-label="Éditer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setToDelete(service)}
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
        title={draft?.id ? "Modifier le service" : "Nouveau service"}
      >
        {draft && (
          <div className="space-y-4">
            <Input
              label="Titre"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <Textarea
              label="Description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
            <Input
              label="Nom de l'icône (lucide-react)"
              value={draft.iconName}
              onChange={(e) => setDraft({ ...draft, iconName: e.target.value })}
            />
            <Input
              label="Ordre"
              type="number"
              value={draft.order}
              onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
            />
            <Switch
              checked={draft.published}
              onCheckedChange={(v) => setDraft({ ...draft, published: v })}
              label="Publié"
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
