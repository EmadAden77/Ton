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
    cameraDistance: "arm-length",
    cameraAngle: "eye-level",
    lightingDirection: "front",
    colorTemperature: "neutral",
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6"
    >
      <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-10">
        <h1 className="text-4xl font-bold">Ton</h1>
        <p className="mt-4 text-slate-300">
          اختر إعدادات اللقطة والكاميرا والإضاءة لمعاينة وصف المشهد.
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
              <option value="front-selfie">سيلفي أمامي (Front selfie)</option>
              <option value="mirror-selfie">سيلفي مرآة (Mirror selfie)</option>
            </select>
          </label>

          <label className="grid gap-2" htmlFor="camera-distance">
            مسافة الكاميرا
            <select
              id="camera-distance"
              value={state.cameraDistance}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  cameraDistance: event.target
                    .value as SceneState["cameraDistance"],
                }))
              }
              className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="close">قريبة (Close)</option>
              <option value="arm-length">طول الذراع (Arm length)</option>
              <option value="extended">ذراع ممدودة (Extended)</option>
            </select>
          </label>

          <label className="grid gap-2" htmlFor="camera-angle">
            زاوية الكاميرا
            <select
              id="camera-angle"
              value={state.cameraAngle}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  cameraAngle: event.target.value as SceneState["cameraAngle"],
                }))
              }
              className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="eye-level">بمستوى العين (Eye level)</option>
              <option value="slightly-above">
                أعلى قليلاً (Slightly above)
              </option>
              <option value="slightly-below">
                أسفل قليلاً (Slightly below)
              </option>
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
              <option value="window-day">نافذة نهار (Day window)</option>
              <option value="window-sunset">نافذة غروب (Sunset window)</option>
              <option value="ceiling">سقف (Ceiling)</option>
              <option value="bedside-lamp">مصباح سرير (Bedside lamp)</option>
            </select>
          </label>

          <label className="grid gap-2" htmlFor="lighting-intensity">
            شدة الإضاءة
            <select
              id="lighting-intensity"
              value={state.lightingIntensity}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  lightingIntensity: event.target
                    .value as SceneState["lightingIntensity"],
                }))
              }
              className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="dim">خافتة (Dim)</option>
              <option value="soft">ناعمة (Soft)</option>
              <option value="medium">متوسطة (Medium)</option>
              <option value="bright">ساطعة (Bright)</option>
            </select>
          </label>

          <label className="grid gap-2" htmlFor="lighting-direction">
            اتجاه الضوء
            <select
              id="lighting-direction"
              value={state.lightingDirection}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  lightingDirection: event.target
                    .value as SceneState["lightingDirection"],
                }))
              }
              className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="front">أمامي (Front)</option>
              <option value="side">جانبي (Side)</option>
              <option value="top">علوي (Top)</option>
              <option value="back-soft">خلفي ناعم (Soft back)</option>
            </select>
          </label>

          <label className="grid gap-2" htmlFor="color-temperature">
            حرارة اللون
            <select
              id="color-temperature"
              value={state.colorTemperature}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  colorTemperature: event.target
                    .value as SceneState["colorTemperature"],
                }))
              }
              className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
            >
              <option value="warm">دافئة (Warm)</option>
              <option value="neutral">محايدة (Neutral)</option>
              <option value="cool">باردة (Cool)</option>
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
