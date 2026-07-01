"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { UploadCloud, X, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function ImageUploader({
  value,
  onChange,
  accept = "image",
  label,
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  accept?: "image" | "pdf" | "all";
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Échec de l'upload");
        onChange(data.url);
        toast.success("Fichier téléversé");
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const acceptMap: Record<string, string[]> =
    accept === "pdf"
      ? { "application/pdf": [".pdf"] }
      : accept === "all"
        ? { "image/*": [], "application/pdf": [".pdf"] }
        : { "image/*": [] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptMap,
    maxFiles: 1,
    multiple: false,
  });

  const isPdf = value?.toLowerCase().endsWith(".pdf");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      )}

      {value ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-[var(--border)]">
          {isPdf ? (
            <div className="flex items-center gap-3 p-4">
              <FileText className="h-8 w-8 text-primary" />
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm text-primary hover:underline"
              >
                {value.split("/").pop()}
              </a>
            </div>
          ) : (
            <div className="relative aspect-video w-full">
              <Image src={value} alt="Aperçu" fill className="object-contain" />
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-danger"
            aria-label="Retirer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center transition-colors hover:border-primary",
            isDragActive && "border-primary bg-primary/5",
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          ) : (
            <UploadCloud className="h-7 w-7 text-[var(--text-muted)]" />
          )}
          <p className="text-sm text-[var(--text-secondary)]">
            {uploading
              ? "Téléversement…"
              : isDragActive
                ? "Déposez ici…"
                : "Glissez un fichier ou cliquez"}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Max 10 Mo</p>
        </div>
      )}
    </div>
  );
}
