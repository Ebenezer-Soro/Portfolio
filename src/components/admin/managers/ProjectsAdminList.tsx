"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/admin/Switch";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteProject, toggleProjectPublished } from "@/lib/actions/projects";
import type { Project } from "@prisma/client";

export function ProjectsAdminList({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const togglePublished = async (project: Project) => {
    setToggling(project.id);
    try {
      const updated = await toggleProjectPublished(project.id);
      setProjects((p) => p.map((x) => (x.id === updated.id ? updated : x)));
      toast.success(updated.published ? "Projet publié" : "Projet masqué");
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setToggling(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteProject(toDelete.id);
      setProjects((p) => p.filter((x) => x.id !== toDelete.id));
      toast.success("Projet supprimé");
      setToDelete(null);
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setDeleting(false);
    }
  };

  if (projects.length === 0) {
    return (
      <p className="card-surface p-8 text-center text-[var(--text-muted)]">
        Aucun projet. Créez votre premier projet.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card-surface flex items-center gap-4 p-4"
          >
            <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
              {project.coverUrl ? (
                <Image
                  src={project.coverUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-medium text-[var(--text-primary)]">
                  {project.title}
                </h3>
                {project.featured && <Badge variant="accent">Mis en avant</Badge>}
                <Badge variant={project.published ? "success" : "neutral"}>
                  {project.published ? "Publié" : "Brouillon"}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                /{project.slug}
              </p>
              {project.tags.length > 0 && (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {project.tags.length} tag{project.tags.length > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id={`pub-${project.id}`}
                checked={project.published}
                onCheckedChange={() => togglePublished(project)}
              />
              <Link
                href={`/admin/projets/${project.id}`}
                className="text-[var(--text-muted)] hover:text-primary"
                aria-label="Éditer"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setToDelete(project)}
                className="text-[var(--text-muted)] hover:text-danger"
                aria-label="Supprimer"
                disabled={toggling === project.id}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={deleting}
        onConfirm={confirmDelete}
        description={`Supprimer « ${toDelete?.title} » ? Cette action est irréversible.`}
      />
    </>
  );
}
