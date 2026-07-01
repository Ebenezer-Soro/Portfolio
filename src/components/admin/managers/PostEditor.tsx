"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/admin/Switch";
import { TagInput } from "@/components/admin/TagInput";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createPost, updatePost, deletePost } from "@/lib/actions/posts";
import type { PostFormData } from "@/lib/validations";
import type { Post } from "@prisma/client";

function isEmptyContent(content: string): boolean {
  if (!content.trim()) return true;
  try {
    const json = JSON.parse(content);
    const text = JSON.stringify(json.content ?? "");
    // Document vide de Tiptap : pas de texte ni de contenu utile.
    return !json.content || json.content.length === 0 || text === '[{"type":"paragraph"}]';
  } catch {
    return false;
  }
}

export function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const [content, setContent] = useState<string>(post?.content ?? "");
  const [form, setForm] = useState<PostFormData>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? null,
    content: post?.content ?? "",
    coverUrl: post?.coverUrl ?? null,
    tags: post?.tags ?? [],
    published: post?.published ?? false,
    featured: post?.featured ?? false,
    readingTime: post?.readingTime ?? null,
  });
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = <K extends keyof PostFormData>(
    key: K,
    value: PostFormData[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmptyContent(content)) {
      toast.error("Le contenu est requis");
      return;
    }
    setSaving(true);
    const data: PostFormData = { ...form, content };
    try {
      if (post) {
        await updatePost(post.id, data);
      } else {
        await createPost(data);
      }
      toast.success(post ? "Article mis à jour" : "Article créé");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    setDeleting(true);
    try {
      await deletePost(post.id);
      toast.success("Article supprimé");
      router.push("/admin/blog");
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
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        {post && (
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
        {post ? "Modifier l'article" : "Nouvel article"}
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
              placeholder="mon-article"
            />
            <Textarea
              label="Extrait"
              value={form.excerpt ?? ""}
              onChange={(e) => set("excerpt", e.target.value || null)}
              rows={3}
            />
            <RichTextEditor
              label="Contenu"
              value={content}
              onChange={(json) => setContent(json)}
            />
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
            <Input
              label="Temps de lecture (min, laisser vide pour calculer)"
              type="number"
              value={form.readingTime ?? ""}
              onChange={(e) =>
                set(
                  "readingTime",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              placeholder="Auto"
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
            {post ? "Enregistrer les modifications" : "Créer l'article"}
          </Button>
        </div>
      </form>

      {post && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(o) => !o && setConfirmOpen(false)}
          loading={deleting}
          onConfirm={handleDelete}
          description={`Supprimer « ${post.title} » ? Cette action est irréversible.`}
        />
      )}
    </>
  );
}
