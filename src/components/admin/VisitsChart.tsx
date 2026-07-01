"use client";

import { useMemo } from "react";
import { formatDate } from "@/lib/utils";
import type { VisitByDay } from "@/types";

// Graphe linéaire SVG des visites/jour (sans dépendance externe).
export function VisitsChart({ data }: { data: VisitByDay[] }) {
  const points = useMemo(() => {
    if (!data.length) return null;
    const w = 800;
    const h = 240;
    const pad = 28;
    const max = Math.max(...data.map((d) => d.count), 1);
    const stepX = data.length > 1 ? (w - pad * 2) / (data.length - 1) : 0;

    const coords = data.map((d, i) => {
      const x = pad + i * stepX;
      const y = h - pad - (d.count / max) * (h - pad * 2);
      return { x, y, ...d };
    });

    const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
    const area = `${pad},${h - pad} ${line} ${pad + (data.length - 1) * stepX},${h - pad}`;
    return { coords, line, area, w, h, pad, max };
  }, [data]);

  if (!points) {
    return (
      <div className="flex h-60 items-center justify-center text-sm text-[var(--text-muted)]">
        Pas encore de données de visites.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${points.w} ${points.h}`}
        className="h-60 w-full min-w-[600px]"
        role="img"
        aria-label="Graphe des visites sur 30 jours"
      >
        <defs>
          <linearGradient id="visitsArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(14,165,233,0.35)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0)" />
          </linearGradient>
        </defs>

        <polygon points={points.area} fill="url(#visitsArea)" />
        <polyline
          points={points.line}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r={3} fill="#0ea5e9" />
            {i % Math.ceil(points.coords.length / 8 || 1) === 0 && (
              <text
                x={c.x}
                y={points.h - 8}
                textAnchor="middle"
                className="fill-[var(--text-muted)] text-[10px]"
              >
                {formatDate(c.date, "d MMM")}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
