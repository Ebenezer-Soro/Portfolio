"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/admin/Switch";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deletePost, togglePostPublished } from "@/lib/actions/posts";
import { formatDate } from "@/lib/utils";
import type { Post } from "@prisma/client";

export function PostsAdminList({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initial);
  const [toDelete, setToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const togglePublished = async (post: Post) => {
    setToggling(post.id);
    try {
      const updated = await togglePostPublished(post.id);
      setPosts((p) => p.map((x) => (x.id === updated.id ? updated : x)));
      toast.success(updated.published ? "Article publié" : "Article masqué");
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
      await deletePost(toDelete.id);
      setPosts((p) => p.filter((x) => x.id !== toDelete.id));
      toast.success("Article supprimé");
      setToDelete(null);
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setDeleting(false);
    }
  };

  if (posts.length === 0) {
    return (
      <p className="card-surface p-8 text-center text-[var(--text-muted)]">
        Aucun article. Créez votre premier article.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="card-surface flex items-center gap-4 p-4"
          >
            <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
              {post.coverUrl ? (
                <Image
                  src={post.coverUrl}
                  alt={post.title}
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
                  {post.title}
                </h3>
                {post.featured && <Badge variant="accent">Mis en avant</Badge>}
                <Badge variant={post.published ? "success" : "neutral"}>
                  {post.published ? "Publié" : "Brouillon"}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                /{post.slug}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {formatDate(post.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id={`pub-${post.id}`}
                checked={post.published}
                onCheckedChange={() => togglePublished(post)}
              />
              <Link
                href={`/admin/blog/${post.id}`}
                className="text-[var(--text-muted)] hover:text-primary"
                aria-label="Éditer"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setToDelete(post)}
                className="text-[var(--text-muted)] hover:text-danger"
                aria-label="Supprimer"
                disabled={toggling === post.id}
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
