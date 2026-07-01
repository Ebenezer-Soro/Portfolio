"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { UploadCloud, Copy, Trash2, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn, formatBytes, formatDate } from "@/lib/utils";
import { ConfirmDialog } from "./ConfirmDialog";
import { deleteMedia } from "@/lib/actions/media";
import type { Media } from "@prisma/client";

export function MediaLibrary({ initialMedia }: { initialMedia: Media[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [filter, setFilter] = useState<"all" | "image" | "pdf">("all");
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState<Media | null>(null);
  const [deleting, setDeleting] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("file", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'upload");
      setMedia((m) => [...data.media, ...m]);
      toast.success(`${data.media.length} fichier(s) ajouté(s)`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [".pdf"] },
  });

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success("URL copiée");
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMedia(toDelete.id);
      setMedia((m) => m.filter((x) => x.id !== toDelete.id));
      toast.success("Média supprimé");
      setToDelete(null);
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = media.filter((m) => filter === "all" || m.type === filter);

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center transition-colors hover:border-primary",
          isDragActive && "border-primary bg-primary/5",
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <UploadCloud className="h-8 w-8 text-[var(--text-muted)]" />
        )}
        <p className="text-sm text-[var(--text-secondary)]">
          Glissez vos fichiers ici ou cliquez (images & PDF, max 10 Mo)
        </p>
      </div>

      <div className="flex gap-2">
        {(["all", "image", "pdf"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
              filter === f
                ? "bg-primary text-white"
                : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-primary",
            )}
          >
            {f === "all" ? "Tout" : f === "image" ? "Images" : "PDF"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-[var(--text-muted)]">Aucun média.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
            >
              <div className="relative flex aspect-square items-center justify-center bg-[var(--bg-secondary)]">
                {m.type === "image" ? (
                  <Image src={m.url} alt={m.alt ?? m.filename} fill className="object-cover" />
                ) : (
                  <FileText className="h-12 w-12 text-primary" />
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(m.url)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 hover:bg-white"
                    aria-label="Copier l'URL"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setToDelete(m)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-danger text-white"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                  {m.filename}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {formatBytes(m.size)} · {formatDate(m.createdAt, "d MMM yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={deleting}
        onConfirm={confirmDelete}
        description={`Supprimer « ${toDelete?.filename} » ? Cette action est irréversible.`}
      />
    </div>
  );
}
