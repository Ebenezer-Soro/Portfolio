"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SortableItem {
  id: string;
}

/**
 * Liste réordonnable par drag & drop (HTML5 natif, sans dépendance).
 * Appelle onReorder avec le nouvel ordre des ids.
 */
export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  render,
}: {
  items: T[];
  onReorder: (ids: string[]) => void;
  render: (item: T) => React.ReactNode;
}) {
  const [order, setOrder] = useState(items);
  const [dragId, setDragId] = useState<string | null>(null);

  // Resynchronise si les items changent depuis l'extérieur.
  if (items.map((i) => i.id).join() !== order.map((i) => i.id).join() && !dragId) {
    setOrder(items);
  }

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const next = [...order];
    const from = next.findIndex((i) => i.id === dragId);
    const to = next.findIndex((i) => i.id === targetId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next);
    setDragId(null);
    onReorder(next.map((i) => i.id));
  };

  return (
    <ul className="space-y-2">
      {order.map((item) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => setDragId(item.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(item.id)}
          onDragEnd={() => setDragId(null)}
          className={cn(
            "flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 transition-shadow",
            dragId === item.id && "opacity-50 shadow-lg",
          )}
        >
          <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-[var(--text-muted)]" />
          <div className="flex-1">{render(item)}</div>
        </li>
      ))}
    </ul>
  );
}
