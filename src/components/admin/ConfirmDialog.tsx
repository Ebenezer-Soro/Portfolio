"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirmer la suppression",
  description = "Cette action est irréversible.",
  confirmLabel = "Supprimer",
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-md">
      <div className="flex flex-col items-center text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
        <div className="mt-6 flex w-full gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="danger" className="flex-1" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
