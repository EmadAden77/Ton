"use client";

import { useState, type ReactNode } from "react";

import { getFieldConstraints } from "@/features/prompt-studio/constraints";
import {
  buildNegativePrompt,
  buildPromptArabic,
  buildPromptEnglish,
} from "@/features/prompt-studio/promptBuilder";
import { SCENARIOS } from "@/features/prompt-studio/scenarios";
import type { SceneState } from "@/features/prompt-studio/types";

type SelectOption = { value: string; label: string };

type CollapsibleSectionProps = {
  title: string;
  badge: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

interface SmartSelectProps {
  id: string;
  field: keyof SceneState;
  state: SceneState;
  onChange: (value: string) => void;
  label: string;
  options: SelectOption[];
  className?: string;
}

const constrainedFields: (keyof SceneState)[] = [
  "cameraDistance",
  "freeHandPosition",
  "phonePosition",
  "eyeDirection",
  "faceExpression",
];

const shotTypeOptions: SelectOption[] = [
  { value: "front-selfie", label: "سيلفي أمامي (Front selfie)" },
  { value: "mirror-selfie", label: "سيلفي مرآة (Mirror selfie)" },
];
const cameraDistanceOptions: SelectOption[] = [
  { value: "close", label: "قريبة (Close)" },
  { value: "arm-length", label: "طول الذراع (Arm length)" },
  { value: "extended", label: "ذراع ممدودة (Extended)" },
];
const cameraAngleOptions: SelectOption[] = [
  { value: "eye-level", label: "بمستوى العين (Eye level)" },
  { value: "slightly-above", label: "أعلى قليلاً (Slightly above)" },
  { value: "slightly-below", label: "أسفل قليلاً (Slightly below)" },
];
const lightingModeOptions: SelectOption[] = [
  { value: "as-in-photo", label: "كما في الصورة (As in photo)" },
  { value: "phone-screen", label: "ضوء شاشة الهاتف (Phone screen)" },
  {
    value: "daylight-closed",
    label: "ضوء نهار — ستائر مغلقة (Daylight, closed curtains)",
  },
  {
    value: "daylight-open",
    label: "ضوء نهار — ستائر مفتوحة (Daylight, open curtains)",
  },
];
const identityPriorityOptions: SelectOption[] = [
  { value: "strict", label: "قصوى (Strict)" },
  { value: "balanced", label: "متوازنة (Balanced)" },
  { value: "flexible", label: "مرنة (Flexible)" },
];
const clothingTopOptions: SelectOption[] = [
  { value: "t-shirt", label: "تي شيرت (T-shirt)" },
  { value: "shirt", label: "قميص (Shirt)" },
  { value: "hoodie", label: "هودي (Hoodie)" },
  { value: "pajama-top", label: "بلوزة نوم (Pajama top)" },
  { value: "sweater", label: "كنزة (Sweater)" },
  { value: "tank-top", label: "قميص بلا أكمام (Tank top)" },
];
const clothingBottomOptions: SelectOption[] = [
  { value: "jeans", label: "بنطال جينز (Jeans)" },
  { value: "shorts", label: "شورت (Shorts)" },
  { value: "pajama-pants", label: "بنطال نوم (Pajama pants)" },
  { value: "sweatpants", label: "بنطال رياضي (Sweatpants)" },
  { value: "none-visible", label: "غير ظاهرة (Not visible)" },
];
const clothingMaterialOptions: SelectOption[] = [
  { value: "cotton", label: "قطن (Cotton)" },
  { value: "denim", label: "دنيم (Denim)" },
  { value: "wool", label: "صوف (Wool)" },
  { value: "polyester", label: "بوليستر (Polyester)" },
  { value: "linen", label: "كتان (Linen)" },
];
const clothingColorOptions: SelectOption[] = [
  { value: "neutral", label: "محايد (Neutral)" },
  { value: "dark", label: "داكن (Dark)" },
  { value: "light", label: "فاتح (Light)" },
  { value: "earth-tone", label: "ترابي (Earth tone)" },
  { value: "pastel", label: "باستيل (Pastel)" },
];
const hairStyleOptions: SelectOption[] = [
  { value: "natural", label: "طبيعي (Natural)" },
  { value: "combed", label: "ممشط (Combed)" },
  { value: "messy-light", label: "فوضوي خفيف (Light messy)" },
  { value: "combed-back", label: "ممشط للخلف (Combed back)" },
  { value: "side-part", label: "مفرق جانبي (Side part)" },
];
const hairLengthOptions: SelectOption[] = [
  { value: "short", label: "قصير (Short)" },
  { value: "medium", label: "متوسط (Medium)" },
  { value: "long", label: "طويل (Long)" },
];
const hairTextureOptions: SelectOption[] = [
  { value: "straight", label: "أملس (Straight)" },
  { value: "wavy", label: "مموج (Wavy)" },
  { value: "curly", label: "مجعد (Curly)" },
];
const poseTypeOptions: SelectOption[] = [
  { value: "standing", label: "وقوف (Standing)" },
  { value: "sitting-bed", label: "جلوس على السرير (Sitting on bed)" },
  { value: "sitting-chair", label: "جلوس على كرسي (Sitting on chair)" },
  { value: "lying-bed", label: "استلقاء على السرير (Lying on bed)" },
  { value: "standing-window", label: "وقوف قرب النافذة (Standing by window)" },
];
const headDirectionOptions: SelectOption[] = [
  { value: "forward", label: "للأمام (Forward)" },
  { value: "slightly-left", label: "يساراً قليلاً (Slightly left)" },
  { value: "slightly-right", label: "يميناً قليلاً (Slightly right)" },
  { value: "down", label: "للأسفل (Down)" },
  { value: "up-soft", label: "لأعلى برفق (Gently up)" },
];
const shoulderPositionOptions: SelectOption[] = [
  { value: "relaxed", label: "مسترخيان (Relaxed)" },
  { value: "one-raised", label: "كتف مرتفع قليلاً (One raised)" },
  { value: "both-back", label: "للخلف (Both back)" },
];
const backPostureOptions: SelectOption[] = [
  { value: "straight", label: "مستقيم (Straight)" },
  { value: "relaxed", label: "مسترخٍ (Relaxed)" },
  { value: "slightly-leaning", label: "مائل قليلاً (Slightly leaning)" },
];
const faceExpressionOptions: SelectOption[] = [
  { value: "neutral", label: "محايد طبيعي (Neutral)" },
  { value: "soft-smile", label: "ابتسامة خفيفة (Soft smile)" },
  { value: "closed-smile", label: "ابتسامة مغلقة (Closed smile)" },
  { value: "calm-focus", label: "تركيز هادئ (Calm focus)" },
  { value: "side-glance", label: "نظرة جانبية (Side glance)" },
  { value: "thinking", label: "تفكير (Thinking)" },
  { value: "sleepy", label: "نعاس خفيف (Sleepy)" },
  { value: "light-laugh", label: "ضحكة خفيفة (Light laugh)" },
];
const eyeDirectionOptions: SelectOption[] = [
  { value: "camera", label: "نحو الكاميرا (Camera)" },
  { value: "mirror", label: "نحو المرآة (Mirror)" },
  { value: "away-soft", label: "بعيداً بلطف (Away)" },
  { value: "down-soft", label: "للأسفل بلطف (Down)" },
];
const mouthStateOptions: SelectOption[] = [
  { value: "closed", label: "مغلق (Closed)" },
  { value: "slightly-open", label: "مفتوح قليلاً (Slightly open)" },
  { value: "smile-closed", label: "ابتسامة مغلقة (Smile closed)" },
  {
    value: "smile-open-light",
    label: "ابتسامة مفتوحة خفيفة (Light open smile)",
  },
];
const freeHandPositionOptions: SelectOption[] = [
  { value: "at-side", label: "بجانب الجسم (At side)" },
  { value: "on-hair", label: "على الشعر (On hair)" },
  { value: "holding-cup", label: "تحمل كوباً (Holding cup)" },
  { value: "holding-phone", label: "تحمل الهاتف (Holding phone)" },
  { value: "touching-chin", label: "تلمس الذقن (Touching chin)" },
  { value: "in-pocket", label: "في الجيب (In pocket)" },
  { value: "on-bed", label: "على السرير (On bed)" },
  { value: "on-chest", label: "على الصدر (On chest)" },
  { value: "on-keyboard", label: "على لوحة المفاتيح (On keyboard)" },
  { value: "holding-cloth", label: "تحمل قطعة قماش (Holding cloth)" },
];
const phonePositionOptions: SelectOption[] = [
  { value: "front-of-face", label: "أمام الوجه (Front of face)" },
  { value: "chest-level", label: "على مستوى الصدر (Chest level)" },
  { value: "above-chest", label: "فوق الصدر (Above chest)" },
  { value: "side-soft", label: "جانبي بلطف (Slightly to the side)" },
];
const handFingersStateOptions: SelectOption[] = [
  { value: "relaxed", label: "مسترخية (Relaxed)" },
  { value: "slightly-curled", label: "ملتفة قليلاً (Slightly curled)" },
  { value: "gripping-soft", label: "قابضة برفق (Soft grip)" },
];
const handVisibilityOptions: SelectOption[] = [
  { value: "fully-visible", label: "ظاهرة بالكامل (Fully visible)" },
  { value: "partially-visible", label: "ظاهرة جزئياً (Partially visible)" },
  { value: "off-frame", label: "خارج الإطار (Off-frame)" },
];

function resolveLockedState(state: SceneState): SceneState {
  let resolved = { ...state };

  for (let pass = 0; pass < constrainedFields.length; pass += 1) {
    let changed = false;

    for (const field of constrainedFields) {
      const constraints = getFieldConstraints(field, resolved);
      if (constraints?.lockedTo === undefined) continue;

      if (String(resolved[field]) !== constraints.lockedTo) {
        resolved = {
          ...resolved,
          [field]: constraints.lockedTo,
        } as SceneState;
        changed = true;
      }
    }

    if (!changed) break;
  }

  return resolved;
}

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

function SmartSelect({
  id,
  field,
  state,
  onChange,
  label,
  options,
  className = "",
}: SmartSelectProps) {
  const constraints = getFieldConstraints(field, state);
  const lockedTo = constraints?.lockedTo;
  const value = lockedTo ?? String(state[field] ?? "");

  return (
    <label className={`grid gap-2 ${className}`} htmlFor={id}>
      <span className="flex items-center gap-2">
        {lockedTo !== undefined && <span aria-hidden="true">🔒</span>}
        <span>{label}</span>
      </span>
      <select
        id={id}
        value={value}
        disabled={lockedTo !== undefined}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {options.map((option) => {
          const constraint = constraints?.options.find(
            (item) => item.value === option.value,
          );
          const disabled = constraint?.disabled ?? false;
          return (
            <option key={option.value} value={option.value} disabled={disabled}>
              {option.label}
              {disabled && constraint?.reason ? ` (${constraint.reason})` : ""}
            </option>
          );
        })}
      </select>
      {lockedTo !== undefined && constraints?.lockReason && (
        <span className="text-xs leading-5 text-amber-300">
          ↳ {constraints.lockReason}
        </span>
      )}
    </label>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"english" | "arabic" | "negative">(
    "english",
  );
  const [state, setState] = useState<SceneState>({
    shotType: "front-selfie",
    lightingMode: "as-in-photo",
    cameraDistance: "arm-length",
    cameraAngle: "eye-level",
    phonePosition: "front-of-face",
    clothingTop: "t-shirt",
    clothingBottom: "shorts",
    clothingMaterial: "cotton",
    clothingColor: "neutral",
    referenceProvided: false,
    identityPriority: "balanced",
    identityNotes: "",
    hairStyle: "natural",
    hairLength: "medium",
    hairTexture: "wavy",
    poseType: "standing",
    headDirection: "forward",
    shoulderPosition: "relaxed",
    handPlacement: "at-side",
    backPosture: "relaxed",
    faceExpression: "neutral",
    eyeDirection: "camera",
    mouthState: "closed",
    freeHandPosition: "at-side",
    handFingersState: "relaxed",
    handVisibility: "fully-visible",
    scenario: "none",
  });

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
            ابنِ لقطة سيلفي داخل الغرفة الثابتة، واختر الإضاءة والشخص والوضعية
            فقط.
          </p>

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

        <div className="grid gap-4">
          <CollapsibleSection title="الكاميرا" badge="3 حقول" defaultOpen>
            <SmartSelect
              id="shot-type"
              field="shotType"
              state={resolvedState}
              label="نوع اللقطة"
              options={shotTypeOptions}
              onChange={(value) =>
                updateField("shotType", value as SceneState["shotType"])
              }
            />
            <SmartSelect
              id="camera-distance"
              field="cameraDistance"
              state={resolvedState}
              label="مسافة الكاميرا"
              options={cameraDistanceOptions}
              onChange={(value) =>
                updateField(
                  "cameraDistance",
                  value as SceneState["cameraDistance"],
                )
              }
            />
            <SmartSelect
              id="camera-angle"
              field="cameraAngle"
              state={resolvedState}
              label="زاوية الكاميرا"
              options={cameraAngleOptions}
              onChange={(value) =>
                updateField("cameraAngle", value as SceneState["cameraAngle"])
              }
            />
          </CollapsibleSection>

          <CollapsibleSection title="الصورة المرجعية" badge="3 حقول">
            <label
              className="flex items-center gap-3 rounded-lg border border-white/20 bg-slate-900 p-3 sm:col-span-2"
              htmlFor="reference-provided"
            >
              <input
                id="reference-provided"
                type="checkbox"
                checked={state.referenceProvided}
                onChange={(event) =>
                  updateField("referenceProvided", event.target.checked)
                }
                className="h-4 w-4 accent-amber-300"
              />
              لدي صورة مرجعية
            </label>

            <SmartSelect
              id="identity-priority"
              field="identityPriority"
              state={resolvedState}
              label="أولوية الحفاظ على الهوية"
              options={identityPriorityOptions}
              onChange={(value) =>
                updateField(
                  "identityPriority",
                  value as SceneState["identityPriority"],
                )
              }
              className="sm:col-span-2"
            />

            <label
              className="grid gap-2 sm:col-span-2"
              htmlFor="identity-notes"
            >
              ملاحظات عن الملامح (اختياري)
              <textarea
                id="identity-notes"
                value={state.identityNotes}
                onChange={(event) =>
                  updateField("identityNotes", event.target.value)
                }
                placeholder="مثال: شعر قصير، حاجب رقيق، عيون واسعة"
                rows={3}
                maxLength={200}
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              />
            </label>

            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200 sm:col-span-2">
              الصورة المرجعية هنا إعداد نصي فقط. لا يتم رفع صورة فعلية في هذه
              المرحلة.
            </p>
          </CollapsibleSection>

          <CollapsibleSection title="الإضاءة" badge="1 حقل" defaultOpen>
            <SmartSelect
              id="lighting-mode"
              field="lightingMode"
              state={resolvedState}
              label="نمط الإضاءة"
              options={lightingModeOptions}
              onChange={(value) =>
                updateField("lightingMode", value as SceneState["lightingMode"])
              }
              className="sm:col-span-2"
            />
          </CollapsibleSection>

          <CollapsibleSection title="الملابس" badge="4 حقول">
            <SmartSelect
              id="clothing-top"
              field="clothingTop"
              state={resolvedState}
              label="القطعة العلوية"
              options={clothingTopOptions}
              onChange={(value) =>
                updateField("clothingTop", value as SceneState["clothingTop"])
              }
            />
            <SmartSelect
              id="clothing-bottom"
              field="clothingBottom"
              state={resolvedState}
              label="القطعة السفلية"
              options={clothingBottomOptions}
              onChange={(value) =>
                updateField(
                  "clothingBottom",
                  value as SceneState["clothingBottom"],
                )
              }
            />
            <SmartSelect
              id="clothing-material"
              field="clothingMaterial"
              state={resolvedState}
              label="المادة"
              options={clothingMaterialOptions}
              onChange={(value) =>
                updateField(
                  "clothingMaterial",
                  value as SceneState["clothingMaterial"],
                )
              }
            />
            <SmartSelect
              id="clothing-color"
              field="clothingColor"
              state={resolvedState}
              label="اللون"
              options={clothingColorOptions}
              onChange={(value) =>
                updateField(
                  "clothingColor",
                  value as SceneState["clothingColor"],
                )
              }
            />
          </CollapsibleSection>

          <CollapsibleSection title="الشعر" badge="3 حقول">
            <SmartSelect
              id="hair-style"
              field="hairStyle"
              state={resolvedState}
              label="التسريحة"
              options={hairStyleOptions}
              onChange={(value) =>
                updateField("hairStyle", value as SceneState["hairStyle"])
              }
            />
            <SmartSelect
              id="hair-length"
              field="hairLength"
              state={resolvedState}
              label="الطول"
              options={hairLengthOptions}
              onChange={(value) =>
                updateField("hairLength", value as SceneState["hairLength"])
              }
            />
            <SmartSelect
              id="hair-texture"
              field="hairTexture"
              state={resolvedState}
              label="الملمس"
              options={hairTextureOptions}
              onChange={(value) =>
                updateField("hairTexture", value as SceneState["hairTexture"])
              }
            />
          </CollapsibleSection>

          <CollapsibleSection title="الوضعية" badge="4 حقول">
            <SmartSelect
              id="pose-type"
              field="poseType"
              state={resolvedState}
              label="الوضعية"
              options={poseTypeOptions}
              onChange={(value) =>
                updateField("poseType", value as SceneState["poseType"])
              }
            />
            <SmartSelect
              id="head-direction"
              field="headDirection"
              state={resolvedState}
              label="اتجاه الرأس"
              options={headDirectionOptions}
              onChange={(value) =>
                updateField(
                  "headDirection",
                  value as SceneState["headDirection"],
                )
              }
            />
            <SmartSelect
              id="shoulder-position"
              field="shoulderPosition"
              state={resolvedState}
              label="وضعية الكتفين"
              options={shoulderPositionOptions}
              onChange={(value) =>
                updateField(
                  "shoulderPosition",
                  value as SceneState["shoulderPosition"],
                )
              }
            />
            <SmartSelect
              id="back-posture"
              field="backPosture"
              state={resolvedState}
              label="وضعية الظهر"
              options={backPostureOptions}
              onChange={(value) =>
                updateField("backPosture", value as SceneState["backPosture"])
              }
            />
          </CollapsibleSection>

          <CollapsibleSection title="تعابير الوجه" badge="3 حقول">
            <SmartSelect
              id="face-expression"
              field="faceExpression"
              state={resolvedState}
              label="تعبير الوجه"
              options={faceExpressionOptions}
              onChange={(value) =>
                updateField(
                  "faceExpression",
                  value as SceneState["faceExpression"],
                )
              }
            />
            <SmartSelect
              id="eye-direction"
              field="eyeDirection"
              state={resolvedState}
              label="اتجاه النظر"
              options={eyeDirectionOptions}
              onChange={(value) =>
                updateField("eyeDirection", value as SceneState["eyeDirection"])
              }
            />
            <SmartSelect
              id="mouth-state"
              field="mouthState"
              state={resolvedState}
              label="حالة الفم"
              options={mouthStateOptions}
              onChange={(value) =>
                updateField("mouthState", value as SceneState["mouthState"])
              }
            />
          </CollapsibleSection>

          <CollapsibleSection title="اليد الحرة" badge="4 حقول">
            <SmartSelect
              id="free-hand-position"
              field="freeHandPosition"
              state={resolvedState}
              label="موقع اليد الحرة"
              options={freeHandPositionOptions}
              onChange={(value) =>
                updateField(
                  "freeHandPosition",
                  value as SceneState["freeHandPosition"],
                )
              }
            />
            <SmartSelect
              id="phone-position"
              field="phonePosition"
              state={resolvedState}
              label="موضع الهاتف"
              options={phonePositionOptions}
              onChange={(value) =>
                updateField(
                  "phonePosition",
                  value as SceneState["phonePosition"],
                )
              }
            />
            <SmartSelect
              id="hand-fingers-state"
              field="handFingersState"
              state={resolvedState}
              label="حالة الأصابع"
              options={handFingersStateOptions}
              onChange={(value) =>
                updateField(
                  "handFingersState",
                  value as SceneState["handFingersState"],
                )
              }
            />
            <SmartSelect
              id="hand-visibility"
              field="handVisibility"
              state={resolvedState}
              label="ظهور اليد في الإطار"
              options={handVisibilityOptions}
              onChange={(value) =>
                updateField(
                  "handVisibility",
                  value as SceneState["handVisibility"],
                )
              }
            />
          </CollapsibleSection>
        </div>

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
            onClick={() =>
              void navigator.clipboard.writeText(prompts[activeTab])
            }
            className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            نسخ
          </button>
        </section>
      </div>
    </main>
  );
}
