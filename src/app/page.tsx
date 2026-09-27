"use client";

import { useState } from "react";

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
    setState((current) =>
      resolveLockedState({ ...current, [field]: value } as SceneState),
    );
  }

  function handleScenarioChange(id: NonNullable<SceneState["scenario"]>) {
    setState((current) => {
      if (id === "none") {
        return resolveLockedState({ ...current, scenario: "none" });
      }
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
      className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-10"
    >
      <div className="mx-auto max-w-2xl">
        <header className="px-1 pb-6">
          <h1 className="text-4xl font-bold">Ton</h1>
          <p className="mt-4 leading-7 text-slate-300">
            ابنِ لقطة سيلفي واقعية من واجهة واحدة. الغرفة ثابتة داخليًا، وأنت
            تختار السيناريو والكاميرا والإضاءة والملابس والوضعية فقط.
          </p>
        </header>

        <section
          aria-label="إعدادات Ton"
          className="grid gap-4"
        >
          <label className="grid gap-2" htmlFor="scenario">
            <span className="font-medium text-slate-200">سيناريو جاهز</span>
            <select
              id="scenario"
              value={state.scenario ?? "none"}
              onChange={(event) =>
                handleScenarioChange(
                  event.target.value as NonNullable<SceneState["scenario"]>,
                )
              }
              className="rounded-xl border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="none">بدون سيناريو (None)</option>
              {SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.labelAr} ({scenario.labelEn})
                </option>
              ))}
            </select>
          </label>

          <PromptControls
            state={state}
            resolvedState={resolvedState}
            updateField={updateField}
          />

          <PromptPreview prompts={prompts} />
        </section>
      </div>
    </main>
  );
}
