"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/admin/Switch";
import { TagInput } from "@/components/admin/TagInput";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/actions/projects";
import type { ProjectFormData } from "@/lib/validations";
import type { Project } from "@prisma/client";

export function ProjectEditor({ project }: { project: Project | null }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormData>({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    content: project?.content ?? null,
    coverUrl: project?.coverUrl ?? null,
    images: project?.images ?? [],
    tags: project?.tags ?? [],
    techStack: project?.techStack ?? [],
    demoUrl: project?.demoUrl ?? null,
    repoUrl: project?.repoUrl ?? null,
    featured: project?.featured ?? false,
    published: project?.published ?? false,
    order: project?.order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const addImage = (url: string | null) => {
    if (!url) return;
    setForm((f) =>
      f.images.includes(url) ? f : { ...f, images: [...f.images, url] },
    );
  };

  const removeImage = (url: string) =>
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (project) {
        await updateProject(project.id, form);
      } else {
        await createProject(form);
      }
      toast.success(project ? "Projet mis à jour" : "Projet créé");
      router.push("/admin/projets");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    setDeleting(true);
    try {
      await deleteProject(project.id);
      toast.success("Projet supprimé");
      router.push("/admin/projets");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message || "Erreur");
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/admin/projets"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        {project && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </Button>
        )}
      </div>

      <h1 className="mb-6 font-display text-2xl font-bold text-[var(--text-primary)]">
        {project ? "Modifier le projet" : "Nouveau projet"}
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface space-y-5 p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Informations
            </h2>
            <Input
              label="Titre"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
            <Input
              label="Slug (laisser vide pour générer automatiquement)"
              value={form.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="mon-projet"
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              required
            />
            <RichTextEditor
              label="Contenu détaillé"
              value={form.content}
              onChange={(json) => set("content", json)}
            />
          </div>

          <div className="card-surface space-y-5 p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Galerie d&apos;images
            </h2>
            <ImageUploader
              label="Ajouter une image à la galerie"
              value={null}
              onChange={addImage}
            />
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {form.images.map((url) => (
                  <div
                    key={url}
                    className="relative aspect-video overflow-hidden rounded-lg border border-[var(--border)]"
                  >
                    <Image src={url} alt="Image" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-danger"
                      aria-label="Retirer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Visuel
            </h2>
            <ImageUploader
              label="Image de couverture"
              value={form.coverUrl}
              onChange={(url) => set("coverUrl", url)}
            />
          </div>

          <div className="card-surface space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Métadonnées
            </h2>
            <TagInput
              label="Tags"
              value={form.tags}
              onChange={(tags) => set("tags", tags)}
            />
            <TagInput
              label="Technologies"
              value={form.techStack}
              onChange={(tech) => set("techStack", tech)}
            />
            <Input
              label="Lien démo"
              value={form.demoUrl ?? ""}
              onChange={(e) => set("demoUrl", e.target.value || null)}
              placeholder="https://…"
            />
            <Input
              label="Lien dépôt"
              value={form.repoUrl ?? ""}
              onChange={(e) => set("repoUrl", e.target.value || null)}
              placeholder="https://…"
            />
            <Input
              label="Ordre"
              type="number"
              value={form.order}
              onChange={(e) => set("order", Number(e.target.value))}
            />
          </div>

          <div className="card-surface space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Statut
            </h2>
            <div className="rounded-lg border border-[var(--border)] p-4">
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", v)}
                label="Mettre en avant"
              />
            </div>
            <div className="rounded-lg border border-[var(--border)] p-4">
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(v) => set("published", v)}
                label="Publié"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            loading={saving}
            className="w-full"
          >
            {project ? "Enregistrer les modifications" : "Créer le projet"}
          </Button>
        </div>
      </form>

      {project && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(o) => !o && setConfirmOpen(false)}
          loading={deleting}
          onConfirm={handleDelete}
          description={`Supprimer « ${project.title} » ? Cette action est irréversible.`}
        />
      )}
    </>
  );
}
