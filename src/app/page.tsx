"use client";

import { useState, type ReactNode } from "react";

import {
  buildNegativePrompt,
  buildPromptArabic,
  buildPromptEnglish,
} from "@/features/prompt-studio/promptBuilder";
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
  const [activeTab, setActiveTab] = useState<"english" | "arabic" | "negative">(
    "english",
  );
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
    clothingTop: "t-shirt",
    clothingBottom: "shorts",
    clothingMaterial: "cotton",
    clothingColor: "neutral",
  });

  const englishPrompt = buildPromptEnglish(state);
  const arabicPrompt = buildPromptArabic(state);
  const negativePrompt = buildNegativePrompt(state);
  const activePrompt =
    activeTab === "english"
      ? englishPrompt
      : activeTab === "arabic"
        ? arabicPrompt
        : negativePrompt;
  const previewTabs = [
    { id: "english", label: "English" },
    { id: "arabic", label: "العربية" },
    { id: "negative", label: "Negative" },
  ] as const;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6"
    >
      <div className="mx-auto max-w-2xl">
        <header className="px-1 pb-6">
          <h1 className="text-4xl font-bold">Ton</h1>
          <p className="mt-4 text-slate-300">
            اختر إعدادات اللقطة والكاميرا والغرفة والملابس والإضاءة لمعاينة وصف
            المشهد.
          </p>
        </header>

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

          <CollapsibleSection title="الملابس" badge="4 حقول">
            <label className="grid gap-2" htmlFor="clothing-top">
              القطعة العلوية
              <select
                id="clothing-top"
                value={state.clothingTop}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    clothingTop: event.target
                      .value as SceneState["clothingTop"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="t-shirt">تي شيرت (T-shirt)</option>
                <option value="shirt">قميص (Shirt)</option>
                <option value="hoodie">هودي (Hoodie)</option>
                <option value="pajama-top">بلوزة نوم (Pajama top)</option>
                <option value="sweater">كنزة (Sweater)</option>
                <option value="tank-top">قميص بلا أكمام (Tank top)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="clothing-bottom">
              القطعة السفلية
              <select
                id="clothing-bottom"
                value={state.clothingBottom}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    clothingBottom: event.target
                      .value as SceneState["clothingBottom"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="jeans">بنطال جينز (Jeans)</option>
                <option value="shorts">شورت (Shorts)</option>
                <option value="pajama-pants">بنطال نوم (Pajama pants)</option>
                <option value="sweatpants">بنطال رياضي (Sweatpants)</option>
                <option value="none-visible">غير ظاهرة (Not visible)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="clothing-material">
              المادة
              <select
                id="clothing-material"
                value={state.clothingMaterial}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    clothingMaterial: event.target
                      .value as SceneState["clothingMaterial"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="cotton">قطن (Cotton)</option>
                <option value="denim">دنيم (Denim)</option>
                <option value="wool">صوف (Wool)</option>
                <option value="polyester">بوليستر (Polyester)</option>
                <option value="linen">كتان (Linen)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="clothing-color">
              اللون
              <select
                id="clothing-color"
                value={state.clothingColor}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    clothingColor: event.target
                      .value as SceneState["clothingColor"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="neutral">محايد (Neutral)</option>
                <option value="dark">داكن (Dark)</option>
                <option value="light">فاتح (Light)</option>
                <option value="earth-tone">ترابي (Earth tone)</option>
                <option value="pastel">باستيل (Pastel)</option>
              </select>
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

        <section
          aria-label="المعاينة"
          className="mt-6 rounded-xl border border-white/10 bg-slate-900 p-5"
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
            {activePrompt}
          </div>

          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(activePrompt)}
            className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            نسخ
          </button>
        </section>
      </div>
    </main>
  );
}
