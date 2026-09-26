"use client";

import { useState } from "react";

import { buildPromptArabic } from "@/features/prompt-studio/promptBuilder";
import type { SceneState } from "@/features/prompt-studio/types";

export default function Home() {
  const [state, setState] = useState<SceneState>({
    shotType: "front-selfie",
    lightingSource: "window-day",
    lightingIntensity: "soft",
    roomType: "simple",
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6"
    >
      <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-10">
        <h1 className="text-4xl font-bold">Ton</h1>
        <p className="mt-4 text-slate-300">
          اختر نوع اللقطة ومصدر الإضاءة لمعاينة وصف المشهد.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2" htmlFor="shot-type">
            نوع اللقطة
            <select
              id="shot-type"
              value={state.shotType}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  shotType: event.target.value as SceneState["shotType"],
                }))
              }
              className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="front-selfie">سيلفي بالكاميرا الأمامية</option>
              <option value="mirror-selfie">سيلفي أمام المرآة</option>
            </select>
          </label>

          <label className="grid gap-2" htmlFor="lighting-source">
            مصدر الإضاءة
            <select
              id="lighting-source"
              value={state.lightingSource}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  lightingSource: event.target
                    .value as SceneState["lightingSource"],
                }))
              }
              className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="window-day">ضوء النهار من النافذة</option>
              <option value="window-sunset">ضوء الغروب من النافذة</option>
              <option value="ceiling">إنارة السقف</option>
              <option value="bedside-lamp">مصباح بجانب السرير</option>
            </select>
          </label>
        </div>

        <section
          aria-live="polite"
          className="mt-8 rounded-xl bg-slate-900 p-5"
        >
          <h2 className="font-semibold">معاينة النص</h2>
          <p className="mt-3 leading-8 text-slate-200">
            {buildPromptArabic(state)}
          </p>
        </section>
      </section>
    </main>
  );
}
