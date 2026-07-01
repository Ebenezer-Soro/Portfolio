import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/managers/PostEditor";
import type { Post } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: Post | null = null;
  if (id !== "new") {
    try {
      post = await prisma.post.findUnique({ where: { id } });
    } catch {
      post = null;
    }
  }

  return <PostEditor post={post} />;
}
