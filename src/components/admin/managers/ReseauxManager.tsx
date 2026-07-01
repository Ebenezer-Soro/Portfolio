"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Star } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Switch } from "@/components/admin/Switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SortableList } from "@/components/admin/SortableList";
import { cn, formatDate, platformColor } from "@/lib/utils";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
  createSocialPost,
  updateSocialPost,
  deleteSocialPost,
  toggleSocialPostFeatured,
  toggleSocialPostActive,
} from "@/lib/actions/social";
import type { SocialLink, SocialPost } from "@prisma/client";

const PLATFORMS = ["GitHub", "LinkedIn", "Twitter", "Instagram", "YouTube", "Facebook"];

// ── Drafts ──────────────────────────────────────────────────
type LinkDraft = {
  id?: string;
  platform: string;
  url: string;
  iconName: string;
  order: number;
  active: boolean;
};

const emptyLink: LinkDraft = {
  platform: "GitHub",
  url: "",
  iconName: "Github",
  order: 0,
  active: true,
};

type PostDraft = {
  id?: string;
  platform: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string | null;
  publishedAt: string;
  featured: boolean;
  active: boolean;
  order: number;
};

const emptyPost: PostDraft = {
  platform: "LinkedIn",
  title: "",
  description: "",
  url: "",
  thumbnailUrl: null,
  publishedAt: "",
  featured: false,
  active: true,
  order: 0,
};

export function ReseauxManager({
  links: initialLinks,
  posts: initialPosts,
}: {
  links: SocialLink[];
  posts: SocialPost[];
}) {
  const [tab, setTab] = useState<"links" | "posts">("links");

  // ── Links state ──────────────────────────────────────────
  const [links, setLinks] = useState(initialLinks);
  const [linkDraft, setLinkDraft] = useState<LinkDraft | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<SocialLink | null>(null);
  const [savingLink, setSavingLink] = useState(false);
  const [deletingLink, setDeletingLink] = useState(false);

  // ── Posts state ──────────────────────────────────────────
  const [posts, setPosts] = useState(initialPosts);
  const [postDraft, setPostDraft] = useState<PostDraft | null>(null);
  const [postToDelete, setPostToDelete] = useState<SocialPost | null>(null);
  const [savingPost, setSavingPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  // ── Link handlers ────────────────────────────────────────
  const saveLink = async () => {
    if (!linkDraft) return;
    setSavingLink(true);
    try {
      const payload = {
        platform: linkDraft.platform,
        url: linkDraft.url,
        iconName: linkDraft.iconName,
        order: Number(linkDraft.order),
        active: linkDraft.active,
      };
      if (linkDraft.id) {
        const updated = await updateSocialLink(linkDraft.id, payload);
        setLinks((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await createSocialLink(payload);
        setLinks((s) => [...s, created]);
      }
      toast.success("Lien enregistré");
      setLinkDraft(null);
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setSavingLink(false);
    }
  };

  const toggleLinkActive = async (link: SocialLink, active: boolean) => {
    try {
      const updated = await updateSocialLink(link.id, {
        platform: link.platform,
        url: link.url,
        iconName: link.iconName,
        order: link.order,
        active,
      });
      setLinks((s) => s.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    }
  };

  const confirmDeleteLink = async () => {
    if (!linkToDelete) return;
    setDeletingLink(true);
    try {
      await deleteSocialLink(linkToDelete.id);
      setLinks((s) => s.filter((x) => x.id !== linkToDelete.id));
      toast.success("Lien supprimé");
      setLinkToDelete(null);
    } catch {
      toast.error("Erreur");
    } finally {
      setDeletingLink(false);
    }
  };

  // ── Post handlers ────────────────────────────────────────
  const savePost = async () => {
    if (!postDraft) return;
    setSavingPost(true);
    try {
      const payload = {
        platform: postDraft.platform,
        title: postDraft.title,
        description: postDraft.description || null,
        url: postDraft.url,
        thumbnailUrl: postDraft.thumbnailUrl || null,
        publishedAt: postDraft.publishedAt || undefined,
        featured: postDraft.featured,
        active: postDraft.active,
        order: Number(postDraft.order),
      };
      if (postDraft.id) {
        const updated = await updateSocialPost(postDraft.id, payload);
        setPosts((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await createSocialPost(payload);
        setPosts((s) => [...s, created]);
      }
      toast.success("Publication enregistrée");
      setPostDraft(null);
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    } finally {
      setSavingPost(false);
    }
  };

  const onToggleFeatured = async (post: SocialPost) => {
    try {
      const updated = await toggleSocialPostFeatured(post.id);
      setPosts((s) => s.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    }
  };

  const onTogglePostActive = async (post: SocialPost) => {
    try {
      const updated = await toggleSocialPostActive(post.id);
      setPosts((s) => s.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e) {
      toast.error((e as Error).message || "Erreur");
    }
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    setDeletingPost(true);
    try {
      await deleteSocialPost(postToDelete.id);
      setPosts((s) => s.filter((x) => x.id !== postToDelete.id));
      toast.success("Publication supprimée");
      setPostToDelete(null);
    } catch {
      toast.error("Erreur");
    } finally {
      setDeletingPost(false);
    }
  };

  const platforms = Array.from(new Set(posts.map((p) => p.platform)));
  const visiblePosts =
    filter === "all" ? posts : posts.filter((p) => p.platform === filter);

  return (
    <>
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setTab("links")}
          className={cn(
            "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            tab === "links"
              ? "border-primary text-primary"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]",
          )}
        >
          Liens réseaux sociaux
        </button>
        <button
          onClick={() => setTab("posts")}
          className={cn(
            "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            tab === "posts"
              ? "border-primary text-primary"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]",
          )}
        >
          Publications partagées
        </button>
      </div>

      {/* ── TAB 1 : Liens ──────────────────────────────────── */}
      {tab === "links" && (
        <>
          <div className="mb-6 flex justify-end">
            <Button onClick={() => setLinkDraft({ ...emptyLink })}>
              <Plus className="h-4 w-4" /> Ajouter un lien
            </Button>
          </div>

          {links.length === 0 ? (
            <p className="card-surface p-8 text-center text-[var(--text-muted)]">
              Aucun lien. Ajoutez-en un.
            </p>
          ) : (
            <>
              <p className="mb-2 text-xs text-[var(--text-muted)]">
                Glissez-déposez pour réordonner les liens.
              </p>
              <SortableList
                items={links}
                onReorder={async (ids) => {
                  setLinks((s) => ids.map((id) => s.find((l) => l.id === id)!).filter(Boolean));
                  try {
                    await reorderSocialLinks(ids);
                  } catch {
                    toast.error("Erreur lors du réordonnancement");
                  }
                }}
                render={(link) => (
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-primary">
                      <Icon name={link.iconName} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--text-primary)]">{link.platform}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 truncate text-xs text-[var(--text-muted)] hover:text-primary"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </div>
                    <Switch
                      checked={link.active}
                      onCheckedChange={(v) => toggleLinkActive(link, v)}
                    />
                    <button
                      onClick={() => setLinkDraft({ ...link })}
                      className="text-[var(--text-muted)] hover:text-primary"
                      aria-label="Éditer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setLinkToDelete(link)}
                      className="text-[var(--text-muted)] hover:text-danger"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              />
            </>
          )}
        </>
      )}

      {/* ── TAB 2 : Publications ───────────────────────────── */}
      {tab === "posts" && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === "all"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                )}
              >
                Toutes
              </button>
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filter === p
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button onClick={() => setPostDraft({ ...emptyPost })}>
              <Plus className="h-4 w-4" /> Ajouter une publication
            </Button>
          </div>

          {visiblePosts.length === 0 ? (
            <p className="card-surface p-8 text-center text-[var(--text-muted)]">
              Aucune publication.
            </p>
          ) : (
            <div className="space-y-3">
              {visiblePosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <Badge
                        className="text-white"
                        style={{ backgroundColor: platformColor(post.platform) }}
                      >
                        {post.platform}
                      </Badge>
                      {post.publishedAt && (
                        <span className="text-xs text-[var(--text-muted)]">
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                    </div>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--text-primary)] hover:text-primary"
                    >
                      {post.title}
                    </a>
                    {post.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">
                        {post.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onToggleFeatured(post)}
                      className={cn(
                        "transition-colors",
                        post.featured
                          ? "text-warning"
                          : "text-[var(--text-muted)] hover:text-warning",
                      )}
                      aria-label="À la une"
                      title="À la une"
                    >
                      <Star
                        className="h-4 w-4"
                        fill={post.featured ? "currentColor" : "none"}
                      />
                    </button>
                    <Switch
                      checked={post.active}
                      onCheckedChange={() => onTogglePostActive(post)}
                    />
                    <button
                      onClick={() => setPostDraft(toPostDraft(post))}
                      className="text-[var(--text-muted)] hover:text-primary"
                      aria-label="Éditer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPostToDelete(post)}
                      className="text-[var(--text-muted)] hover:text-danger"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Link Modal ─────────────────────────────────────── */}
      <Modal
        open={!!linkDraft}
        onOpenChange={(o) => !o && setLinkDraft(null)}
        title={linkDraft?.id ? "Modifier le lien" : "Nouveau lien"}
      >
        {linkDraft && (
          <div className="space-y-4">
            <Select
              label="Plateforme"
              value={linkDraft.platform}
              onChange={(e) => setLinkDraft({ ...linkDraft, platform: e.target.value })}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
            <Input
              label="URL"
              type="url"
              value={linkDraft.url}
              onChange={(e) => setLinkDraft({ ...linkDraft, url: e.target.value })}
            />
            <Input
              label="Nom de l'icône (lucide)"
              placeholder="Github, Linkedin, Twitter…"
              value={linkDraft.iconName}
              onChange={(e) => setLinkDraft({ ...linkDraft, iconName: e.target.value })}
            />
            <Input
              label="Ordre"
              type="number"
              value={linkDraft.order}
              onChange={(e) =>
                setLinkDraft({ ...linkDraft, order: Number(e.target.value) })
              }
            />
            <Switch
              label="Actif"
              checked={linkDraft.active}
              onCheckedChange={(v) => setLinkDraft({ ...linkDraft, active: v })}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setLinkDraft(null)}>
                Annuler
              </Button>
              <Button loading={savingLink} onClick={saveLink}>
                Enregistrer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Post Modal ─────────────────────────────────────── */}
      <Modal
        open={!!postDraft}
        onOpenChange={(o) => !o && setPostDraft(null)}
        title={postDraft?.id ? "Modifier la publication" : "Nouvelle publication"}
      >
        {postDraft && (
          <div className="space-y-4">
            <Select
              label="Plateforme"
              value={postDraft.platform}
              onChange={(e) => setPostDraft({ ...postDraft, platform: e.target.value })}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
            <Input
              label="Titre"
              value={postDraft.title}
              onChange={(e) => setPostDraft({ ...postDraft, title: e.target.value })}
            />
            <Textarea
              label="Description"
              value={postDraft.description}
              onChange={(e) =>
                setPostDraft({ ...postDraft, description: e.target.value })
              }
            />
            <Input
              label="URL"
              type="url"
              value={postDraft.url}
              onChange={(e) => setPostDraft({ ...postDraft, url: e.target.value })}
            />
            <ImageUploader
              label="Vignette"
              accept="image"
              value={postDraft.thumbnailUrl}
              onChange={(url) => setPostDraft({ ...postDraft, thumbnailUrl: url })}
            />
            <Input
              label="Date de publication"
              type="date"
              value={postDraft.publishedAt}
              onChange={(e) =>
                setPostDraft({ ...postDraft, publishedAt: e.target.value })
              }
            />
            <Input
              label="Ordre"
              type="number"
              value={postDraft.order}
              onChange={(e) =>
                setPostDraft({ ...postDraft, order: Number(e.target.value) })
              }
            />
            <div className="flex gap-6">
              <Switch
                label="À la une"
                checked={postDraft.featured}
                onCheckedChange={(v) => setPostDraft({ ...postDraft, featured: v })}
              />
              <Switch
                label="Actif"
                checked={postDraft.active}
                onCheckedChange={(v) => setPostDraft({ ...postDraft, active: v })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setPostDraft(null)}>
                Annuler
              </Button>
              <Button loading={savingPost} onClick={savePost}>
                Enregistrer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Confirm dialogs ────────────────────────────────── */}
      <ConfirmDialog
        open={!!linkToDelete}
        onOpenChange={(o) => !o && setLinkToDelete(null)}
        loading={deletingLink}
        onConfirm={confirmDeleteLink}
        description={`Supprimer le lien « ${linkToDelete?.platform} » ?`}
      />
      <ConfirmDialog
        open={!!postToDelete}
        onOpenChange={(o) => !o && setPostToDelete(null)}
        loading={deletingPost}
        onConfirm={confirmDeletePost}
        description={`Supprimer la publication « ${postToDelete?.title} » ?`}
      />
    </>
  );
}

function toPostDraft(post: SocialPost): PostDraft {
  return {
    id: post.id,
    platform: post.platform,
    title: post.title,
    description: post.description ?? "",
    url: post.url,
    thumbnailUrl: post.thumbnailUrl,
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt).toISOString().slice(0, 10)
      : "",
    featured: post.featured,
    active: post.active,
    order: post.order,
  };
}
