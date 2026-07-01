"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2, CheckCheck, Reply } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  markMessageRead,
  deleteMessage,
  markAllMessagesRead,
} from "@/lib/actions/messages";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import type { ContactMessage } from "@prisma/client";

export function MessagesManager({ initial }: { initial: ContactMessage[] }) {
  const [messages, setMessages] = useState(initial);
  const [open, setOpen] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = messages.filter((m) => !m.read).length;

  const setRead = async (msg: ContactMessage, read: boolean) => {
    try {
      const updated = await markMessageRead(msg.id, read);
      setMessages((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      setOpen((o) => (o && o.id === updated.id ? updated : o));
    } catch {
      toast.error("Erreur");
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setOpen(msg);
    if (!msg.read) setRead(msg, true);
  };

  const markAll = async () => {
    setMarkingAll(true);
    try {
      await markAllMessagesRead();
      setMessages((s) => s.map((x) => ({ ...x, read: true })));
      toast.success("Tous les messages sont marqués comme lus");
    } catch {
      toast.error("Erreur");
    } finally {
      setMarkingAll(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMessage(toDelete.id);
      setMessages((s) => s.filter((x) => x.id !== toDelete.id));
      if (open?.id === toDelete.id) setOpen(null);
      toast.success("Message supprimé");
      setToDelete(null);
    } catch {
      toast.error("Erreur");
    } finally {
      setDeleting(false);
    }
  };

  const mailto = (msg: ContactMessage) =>
    `mailto:${msg.email}?subject=${encodeURIComponent(
      `Re: ${msg.subject || "Votre message"}`,
    )}`;

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-muted)]">
          {unreadCount > 0
            ? `${unreadCount} message(s) non lu(s)`
            : "Tous les messages sont lus"}
        </p>
        <Button
          variant="secondary"
          loading={markingAll}
          disabled={unreadCount === 0}
          onClick={markAll}
        >
          <CheckCheck className="h-4 w-4" /> Tout marquer comme lu
        </Button>
      </div>

      {messages.length === 0 ? (
        <p className="card-surface p-8 text-center text-[var(--text-muted)]">
          Aucun message reçu.
        </p>
      ) : (
        <ul className="space-y-2">
          {messages.map((msg) => (
            <li
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={cn(
                "card-surface flex cursor-pointer items-center gap-4 p-4 transition-colors hover:border-primary-400",
                !msg.read && "border-l-4 border-l-primary",
              )}
            >
              <span className="text-[var(--text-muted)]">
                {msg.read ? (
                  <MailOpen className="h-5 w-5" />
                ) : (
                  <Mail className="h-5 w-5 text-primary" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "truncate text-[var(--text-primary)]",
                      !msg.read && "font-semibold",
                    )}
                  >
                    {msg.name}
                  </p>
                  <span className="truncate text-xs text-[var(--text-muted)]">{msg.email}</span>
                </div>
                <p
                  className={cn(
                    "truncate text-sm text-[var(--text-secondary)]",
                    !msg.read && "font-medium",
                  )}
                >
                  {msg.subject || "(sans objet)"} — {msg.message}
                </p>
              </div>
              <span className="hidden shrink-0 text-xs text-[var(--text-muted)] sm:block">
                {timeAgo(msg.createdAt)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setToDelete(msg);
                }}
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
        open={!!open}
        onOpenChange={(o) => !o && setOpen(null)}
        title={open?.subject || "(sans objet)"}
      >
        {open && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div>
                <p className="font-medium text-[var(--text-primary)]">{open.name}</p>
                <a
                  href={`mailto:${open.email}`}
                  className="text-primary hover:underline"
                >
                  {open.email}
                </a>
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                {formatDate(open.createdAt, "d MMMM yyyy 'à' HH:mm")}
              </span>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
              {open.message}
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setRead(open, !open.read)}>
                {open.read ? (
                  <>
                    <Mail className="h-4 w-4" /> Marquer non lu
                  </>
                ) : (
                  <>
                    <MailOpen className="h-4 w-4" /> Marquer lu
                  </>
                )}
              </Button>
              <Button
                variant="danger"
                onClick={() => setToDelete(open)}
              >
                <Trash2 className="h-4 w-4" /> Supprimer
              </Button>
              <a href={mailto(open)}>
                <Button>
                  <Reply className="h-4 w-4" /> Répondre
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={deleting}
        onConfirm={confirmDelete}
        description={`Supprimer le message de « ${toDelete?.name} » ?`}
      />
    </>
  );
}
