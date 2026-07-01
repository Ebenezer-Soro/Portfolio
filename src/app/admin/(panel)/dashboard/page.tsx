import { Users, CalendarDays, CalendarRange, MailWarning, FolderKanban, PenLine, MessageSquareQuote } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";
import { VisitsChart } from "@/components/admin/VisitsChart";
import { PageHeader } from "@/components/admin/PageHeader";
import type { VisitByDay, TopPage } from "@/types";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    const [
      totalVisits,
      todayVisits,
      weekVisits,
      unreadMessages,
      publishedProjects,
      publishedPosts,
      pendingTestimonials,
      visitsByDay,
      topPages,
    ] = await Promise.all([
      prisma.visit.count(),
      prisma.visit.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.visit.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.project.count({ where: { published: true } }),
      prisma.post.count({ where: { published: true } }),
      prisma.testimonial.count({ where: { published: false } }),
      prisma.$queryRaw<VisitByDay[]>`
        SELECT TO_CHAR(DATE("createdAt"), 'YYYY-MM-DD') as date, COUNT(*)::int as count
        FROM "Visit"
        WHERE "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
      prisma.$queryRaw<TopPage[]>`
        SELECT path, COUNT(*)::int as count
        FROM "Visit"
        GROUP BY path
        ORDER BY count DESC
        LIMIT 5
      `,
    ]);

    return {
      totalVisits,
      todayVisits,
      weekVisits,
      unreadMessages,
      publishedProjects,
      publishedPosts,
      pendingTestimonials,
      visitsByDay,
      topPages,
    };
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  if (!stats) {
    return (
      <>
        <PageHeader title="Dashboard" description="Vue d'ensemble de votre activité" />
        <div className="card-surface p-8 text-center text-[var(--text-secondary)]">
          Base de données indisponible. Vérifiez la connexion PostgreSQL puis rechargez.
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Dashboard" description="Vue d'ensemble de votre activité" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Visites totales" value={stats.totalVisits} icon={Users} accent="primary" />
        <StatsCard label="Aujourd'hui" value={stats.todayVisits} icon={CalendarDays} accent="accent" />
        <StatsCard label="Cette semaine" value={stats.weekVisits} icon={CalendarRange} accent="success" />
        <StatsCard
          label="Messages non lus"
          value={stats.unreadMessages}
          icon={MailWarning}
          accent={stats.unreadMessages > 0 ? "danger" : "primary"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--text-primary)]">
            Visites — 30 derniers jours
          </h2>
          <VisitsChart data={stats.visitsByDay} />
        </div>

        <div className="card-surface p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--text-primary)]">
            Pages les plus visitées
          </h2>
          {stats.topPages.length ? (
            <ul className="space-y-3">
              {stats.topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-mono text-[var(--text-secondary)]">{p.path}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {p.count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">Aucune visite enregistrée.</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatsCard label="Projets publiés" value={stats.publishedProjects} icon={FolderKanban} accent="primary" />
        <StatsCard label="Articles publiés" value={stats.publishedPosts} icon={PenLine} accent="accent" />
        <StatsCard label="Témoignages en attente" value={stats.pendingTestimonials} icon={MessageSquareQuote} accent="success" />
      </div>
    </>
  );
}
