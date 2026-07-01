import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { MessagesManager } from "@/components/admin/managers/MessagesManager";
import type { ContactMessage } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  let messages: ContactMessage[] = [];
  try {
    messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    messages = [];
  }

  return (
    <>
      <PageHeader title="Messages" description="Consultez les messages reçus via le formulaire de contact" />
      <MessagesManager initial={messages} />
    </>
  );
}
