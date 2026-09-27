"use client";

import { useState, type ReactNode } from "react";

type CollapsibleSectionProps = {
  title: string;
  badge: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsibleSection({
  title,
  badge,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/70">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-3 p-5 text-right"
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={isOpen ? "inline-block rotate-180" : "inline-block"}
          >
            ⌄
          </span>
          <span className="font-semibold">{title}</span>
        </span>
        <span className="text-sm text-slate-400">{badge}</span>
      </button>

      {isOpen && (
        <div className="grid gap-5 border-t border-white/10 p-5 sm:grid-cols-2">
          {children}
        </div>
      )}
    </section>
  );
}
