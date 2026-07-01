"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TagInput({
  value,
  onChange,
  label,
  placeholder = "Ajouter puis Entrée",
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const add = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(input);
            } else if (e.key === "Backspace" && !input && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => input && add(input)}
          placeholder={placeholder}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
        />
      </div>
    </div>
  );
}
