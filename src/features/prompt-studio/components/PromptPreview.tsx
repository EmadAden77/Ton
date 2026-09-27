"use client";

import { useState } from "react";

type PromptKey = "english" | "arabic" | "negative";

type PromptPreviewProps = {
  prompts: Record<PromptKey, string>;
};

const previewTabs = [
  { id: "english", label: "English" },
  { id: "arabic", label: "العربية" },
  { id: "negative", label: "Negative" },
] as const;

export function PromptPreview({ prompts }: PromptPreviewProps) {
  const [activeTab, setActiveTab] = useState<PromptKey>("english");

  return (
    <section
      aria-label="المعاينة"
      className="mt-6 rounded-xl border border-white/10 bg-slate-900 p-5 sm:sticky sm:bottom-0 sm:z-20 sm:shadow-2xl"
    >
      <div
        role="tablist"
        aria-label="نوع المعاينة"
        className="flex flex-wrap gap-2"
      >
        {previewTabs.map(({ id, label }) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls="prompt-panel"
            tabIndex={activeTab === id ? 0 : -1}
            onClick={() => setActiveTab(id)}
            className={
              activeTab === id
                ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div
        id="prompt-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        aria-live="polite"
        dir={activeTab === "arabic" ? "rtl" : "ltr"}
        className="mt-4 min-h-[150px] max-h-72 overflow-y-auto rounded-lg border border-white/10 bg-slate-950/80 p-4 leading-7 text-slate-200"
      >
        {prompts[activeTab]}
      </div>

      <button
        type="button"
        onClick={() => void navigator.clipboard.writeText(prompts[activeTab])}
        className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
      >
        نسخ
      </button>
    </section>
  );
}
