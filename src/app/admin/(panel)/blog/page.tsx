import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { PostsAdminList } from "@/components/admin/managers/PostsAdminList";
import type { Post } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    posts = [];
  }

  return (
    <>
      <PageHeader
        title="Blog"
        description="Gérez vos articles et publications"
        action={
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="h-4 w-4" /> Nouvel article
            </Button>
          </Link>
        }
      />
      <PostsAdminList posts={posts} />
    </>
  );
}
