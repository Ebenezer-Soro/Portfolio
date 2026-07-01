"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ value, label, showValue = true, className }: ProgressBarProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-[var(--text-primary)]">{label}</span>}
          {showValue && <span className="text-[var(--text-muted)]">{clamped}%</span>}
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${clamped}%` : 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
