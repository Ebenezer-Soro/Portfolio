"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout({
  children,
  unreadCount,
  userName,
}: {
  children: React.ReactNode;
  unreadCount: number;
  userName?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Le tiroir se referme au changement de page : sur mobile, il masquerait
  // sinon le contenu que l'on vient d'ouvrir.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname]);

  // Les fenêtres d'édition (Radix) sont rendues dans un portail rattaché à
  // <body>, donc HORS de ce conteneur : elles ignoraient la palette de
  // l'admin — en mode sombre, bouton « Enregistrer » blanc sur or, 2:1.
  // La classe est posée aussi sur <body> le temps de la visite de l'admin.
  useEffect(() => {
    document.body.classList.add("admin-scope");
    return () => document.body.classList.remove("admin-scope");
  }, []);

  // Empêche le défilement de l'arrière-plan pendant que le tiroir est ouvert.
  useEffect(() => {
    if (!open) return;
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = precedent;
    };
  }, [open]);

  return (
    <div className="admin-scope min-h-screen">
      <Sidebar unreadCount={unreadCount} open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenu={() => setOpen(true)} userName={userName} />
        <main className="mx-auto w-full max-w-[1400px] p-3 sm:p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
