"use client";

import { useState } from "react";

import RoomScene from "@/components/RoomScene";
import { PromptControls } from "@/features/prompt-studio/components/PromptControls";
import { PromptPreview } from "@/features/prompt-studio/components/PromptPreview";
import {
  buildNegativePrompt,
  buildPromptArabic,
  buildPromptEnglish,
} from "@/features/prompt-studio/promptBuilder";
import { SCENARIOS } from "@/features/prompt-studio/scenarios";
import {
  createDefaultSceneState,
  resolveLockedState,
} from "@/features/prompt-studio/state";
import type { SceneState } from "@/features/prompt-studio/types";

export default function Home() {
  const [state, setState] = useState<SceneState>(createDefaultSceneState);
  const resolvedState = resolveLockedState(state);

  function updateField<K extends keyof SceneState>(
    field: K,
    value: SceneState[K],
  ) {
    setState((current) => ({ ...current, [field]: value }));
  }

  function handleScenarioChange(id: NonNullable<SceneState["scenario"]>) {
    setState((current) => {
      if (id === "none") return { ...current, scenario: "none" };
      const preset = SCENARIOS.find((item) => item.id === id);
      return preset ? preset.apply(current) : current;
    });
  }

  const prompts = {
    english: buildPromptEnglish(resolvedState),
    arabic: buildPromptArabic(resolvedState),
    negative: buildNegativePrompt(resolvedState),
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6"
    >
      <div className="mx-auto max-w-2xl">
        <header className="px-1 pb-6">
          <h1 className="text-4xl font-bold">Ton</h1>
          <p className="mt-4 text-slate-300">
            ابنِ لقطة سيلفي داخل الغرفة الثابتة، واختر الإضاءة والشخص والوضعية
            فقط.
          </p>

          <a
            href="/3d"
            className="mt-4 inline-flex rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300 transition hover:bg-sky-500/20 hover:text-sky-200"
          >
            🎮 تجربة المحاكي 3D
          </a>

          <label className="mt-6 grid gap-2" htmlFor="scenario">
            سيناريو جاهز
            <select
              id="scenario"
              value={state.scenario ?? "none"}
              onChange={(event) =>
                handleScenarioChange(
                  event.target.value as NonNullable<SceneState["scenario"]>,
                )
              }
              className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="none">بدون سيناريو (None)</option>
              {SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.labelAr} ({scenario.labelEn})
                </option>
              ))}
            </select>
          </label>
        </header>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
          <h3 className="mb-3 text-sm font-bold text-slate-300">
            عرض الغرفة من الأعلى
          </h3>
          <div className="flex justify-center">
            <RoomScene sceneState={resolvedState} />
          </div>
        </section>

        <PromptControls
          state={state}
          resolvedState={resolvedState}
          updateField={updateField}
        />

        <PromptPreview prompts={prompts} />
      </div>
    </main>
  );
}
