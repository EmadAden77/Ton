"use client";

import { useState, type ReactNode } from "react";

import { buildPromptArabic } from "@/features/prompt-studio/promptBuilder";
import type { SceneState } from "@/features/prompt-studio/types";

type CollapsibleSectionProps = {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function CollapsibleSection({
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
        {badge && <span className="text-sm text-slate-400">{badge}</span>}
      </button>
      {isOpen && (
        <div className="grid gap-5 border-t border-white/10 p-5 sm:grid-cols-2">
          {children}
        </div>
      )}
    </section>
  );
}

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
    roomCleanliness: "natural",
    roomWindow: "medium",
    roomHasBed: true,
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6"
    >
      <div className="mx-auto max-w-2xl">
        <header className="px-1 pb-6">
          <h1 className="text-4xl font-bold">Ton</h1>
          <p className="mt-4 text-slate-300">
            اختر إعدادات اللقطة والكاميرا والغرفة والإضاءة لمعاينة وصف المشهد.
          </p>
        </header>

        <section
          aria-live="polite"
          className="sticky top-0 z-10 rounded-xl border border-amber-300/20 bg-slate-900/95 p-5 shadow-lg backdrop-blur"
        >
          <h2 className="font-semibold">المعاينة الحية</h2>
          <p className="mt-3 leading-8 text-slate-200">
            {buildPromptArabic(state)}
          </p>
        </section>

        <div className="mt-6 grid gap-4">
          <CollapsibleSection
            title="الكاميرا والتصوير"
            badge="3 حقول"
            defaultOpen
          >
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
                <option value="mirror-selfie">
                  سيلفي مرآة (Mirror selfie)
                </option>
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
                    cameraAngle: event.target
                      .value as SceneState["cameraAngle"],
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
          </CollapsibleSection>

          <CollapsibleSection title="الغرفة والخلفية" badge="4 حقول">
            <label className="grid gap-2" htmlFor="room-type">
              نوع الغرفة
              <select
                id="room-type"
                value={state.roomType}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    roomType: event.target.value as SceneState["roomType"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="simple">بسيطة (Simple)</option>
                <option value="modern">حديثة (Modern)</option>
                <option value="small">صغيرة (Small)</option>
                <option value="medium">متوسطة (Medium)</option>
              </select>
            </label>
            <label className="grid gap-2" htmlFor="room-cleanliness">
              ترتيب الغرفة
              <select
                id="room-cleanliness"
                value={state.roomCleanliness}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    roomCleanliness: event.target
                      .value as SceneState["roomCleanliness"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="very-tidy">مرتبة جداً (Very tidy)</option>
                <option value="natural">طبيعي (Natural)</option>
                <option value="light-mess">فوضى خفيفة (Light mess)</option>
                <option value="moderate-mess">
                  فوضى متوسطة (Moderate mess)
                </option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="room-window">
              حجم النافذة
              <select
                id="room-window"
                value={state.roomWindow}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    roomWindow: event.target.value as SceneState["roomWindow"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="none">بلا نافذة (None)</option>
                <option value="small">صغيرة (Small)</option>
                <option value="medium">متوسطة (Medium)</option>
                <option value="large">كبيرة (Large)</option>
              </select>
            </label>

            <label
              className="flex items-center gap-3 rounded-lg border border-white/20 bg-slate-900 p-3"
              htmlFor="room-has-bed"
            >
              <input
                id="room-has-bed"
                type="checkbox"
                checked={state.roomHasBed}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    roomHasBed: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-amber-300"
              />
              يوجد سرير (Bed)
            </label>
          </CollapsibleSection>

          <CollapsibleSection title="الإضاءة الواقعية" badge="4 حقول">
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
                <option value="window-sunset">
                  نافذة غروب (Sunset window)
                </option>
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
          </CollapsibleSection>

          <CollapsibleSection title="خيارات متقدمة" badge="0 حقول">
            {null}
          </CollapsibleSection>
        </div>
      </div>
    </main>
  );
}
