"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Switch } from "@/components/admin/Switch";
import { createFaq, updateFaq, deleteFaq, toggleFaqActive } from "@/lib/actions/faq";
import type { FAQ } from "@prisma/client";

type FaqFormData = {
  question: string;
  answer: string;
  order: number;
  active: boolean;
};

type Draft = FaqFormData & { id?: string };

const empty: Draft = {
  question: "",
  answer: "",
  order: 0,
  active: true,
};

export function FaqManager({ initial }: { initial: FAQ[] }) {
  const [faqs, setFaqs] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [toDelete, setToDelete] = useState<FAQ | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = (faq: FAQ) => {
    setDraft({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      active: faq.active,
    });
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const payload = {
        question: draft.question,
        answer: draft.answer,
        order: Number(draft.order),
        active: draft.active,
      };
      if (draft.id) {
        const updated = await updateFaq(draft.id, payload);
        setFaqs((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await createFaq(payload);
        setFaqs((s) => [...s, created]);
      }
      toast.success("FAQ enregistrée");
      setDraft(null);
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (faq: FAQ) => {
    try {
      const updated = await toggleFaqActive(faq.id);
      setFaqs((s) => s.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      toast.error("Erreur");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteFaq(toDelete.id);
      setFaqs((s) => s.filter((x) => x.id !== toDelete.id));
      toast.success("FAQ supprimée");
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
          <Plus className="h-4 w-4" /> Ajouter une question
        </Button>
      </div>

      {faqs.length === 0 ? (
        <p className="card-surface p-8 text-center text-[var(--text-muted)]">
          Aucune question. Ajoutez-en une.
        </p>
      ) : (
        <ul className="space-y-3">
          {faqs.map((faq) => (
            <li key={faq.id} className="card-surface flex items-center gap-4 p-4">
              <div className="flex-1">
                <span className="font-medium text-[var(--text-primary)]">{faq.question}</span>
                <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
              <Switch checked={faq.active} onCheckedChange={() => toggleActive(faq)} />
              <button
                onClick={() => startEdit(faq)}
                className="text-[var(--text-muted)] hover:text-primary"
                aria-label="Éditer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => setToDelete(faq)}
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
        title={draft?.id ? "Modifier la question" : "Nouvelle question"}
      >
        {draft && (
          <div className="space-y-4">
            <Input
              label="Question"
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            />
            <Textarea
              label="Réponse"
              value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            />
            <Input
              label="Ordre"
              type="number"
              value={draft.order}
              onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
            />
            <Switch
              checked={draft.active}
              onCheckedChange={(v) => setDraft({ ...draft, active: v })}
              label="Active"
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
        description={`Supprimer « ${toDelete?.question} » ?`}
      />
    </>
  );
}
