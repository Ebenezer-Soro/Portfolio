"use client";

import { Icon } from "@/components/ui/Icon";
import { platformColor, cn } from "@/lib/utils";
import type { SocialLink } from "@prisma/client";

export interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  iconSize?: number;
}

export function SocialLinks({ links, className, iconSize = 20 }: SocialLinksProps) {
  if (!links.length) return null;

  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.platform}
            title={link.platform}
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-all duration-300 hover:-translate-y-1 hover:scale-110"
            style={{ ["--hover" as string]: platformColor(link.platform) }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = platformColor(link.platform);
              e.currentTarget.style.borderColor = platformColor(link.platform);
              e.currentTarget.style.boxShadow = `0 0 18px ${platformColor(link.platform)}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "";
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <Icon name={link.iconName} size={iconSize} fallback="Link" />
          </a>
        </li>
      ))}
    </ul>
  );
}
