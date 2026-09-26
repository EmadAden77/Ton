"use client";

import { useState, type ReactNode } from "react";

import {
  buildNegativePrompt,
  buildPromptArabic,
  buildPromptEnglish,
} from "@/features/prompt-studio/promptBuilder";
import { SCENARIOS } from "@/features/prompt-studio/scenarios";
import type { SceneState } from "@/features/prompt-studio/types";
import { getFieldConstraints } from "../features/prompt-studio/constraints";

type CollapsibleSectionProps = {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

type SelectOption = {
  value: string;
  label: string;
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

interface SmartCheckboxProps {
  id: string;
  field: keyof SceneState;
  state: SceneState;
  onChange: (value: boolean) => void;
  label: string;
  className?: string;
}

interface SmartTextareaProps {
  id: string;
  field: keyof SceneState;
  state: SceneState;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

const constraintFields: (keyof SceneState)[] = [
  "shotType",
  "lightingSource",
  "lightingIntensity",
  "roomType",
  "cameraDistance",
  "cameraAngle",
  "lightingDirection",
  "colorTemperature",
  "roomCleanliness",
  "roomWindow",
  "roomHasBed",
  "clothingTop",
  "clothingBottom",
  "clothingMaterial",
  "clothingColor",
  "referenceProvided",
  "identityPriority",
  "identityNotes",
  "hairStyle",
  "hairLength",
  "hairTexture",
  "poseType",
  "headDirection",
  "shoulderPosition",
  "handPlacement",
  "backPosture",
  "faceExpression",
  "eyeDirection",
  "mouthState",
  "freeHandPosition",
  "handFingersState",
  "handVisibility",
  "scenario",
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

const identityPriorityOptions: SelectOption[] = [
  { value: "strict", label: "قصوى (Strict)" },
  { value: "balanced", label: "متوازنة (Balanced)" },
  { value: "flexible", label: "مرنة (Flexible)" },
];

const roomTypeOptions: SelectOption[] = [
  { value: "simple", label: "بسيطة (Simple)" },
  { value: "modern", label: "حديثة (Modern)" },
  { value: "small", label: "صغيرة (Small)" },
  { value: "medium", label: "متوسطة (Medium)" },
];

const roomCleanlinessOptions: SelectOption[] = [
  { value: "very-tidy", label: "مرتبة جداً (Very tidy)" },
  { value: "natural", label: "طبيعي (Natural)" },
  { value: "light-mess", label: "فوضى خفيفة (Light mess)" },
  { value: "moderate-mess", label: "فوضى متوسطة (Moderate mess)" },
];

const roomWindowOptions: SelectOption[] = [
  { value: "none", label: "بلا نافذة (None)" },
  { value: "small", label: "صغيرة (Small)" },
  { value: "medium", label: "متوسطة (Medium)" },
  { value: "large", label: "كبيرة (Large)" },
];

const lightingSourceOptions: SelectOption[] = [
  { value: "window-day", label: "نافذة نهار (Day window)" },
  { value: "window-sunset", label: "نافذة غروب (Sunset window)" },
  { value: "ceiling", label: "سقف (Ceiling)" },
  { value: "bedside-lamp", label: "مصباح سرير (Bedside lamp)" },
  { value: "laptop-screen", label: "ضوء شاشة لابتوب (Laptop screen)" },
];

const lightingIntensityOptions: SelectOption[] = [
  { value: "dim", label: "خافتة (Dim)" },
  { value: "soft", label: "ناعمة (Soft)" },
  { value: "medium", label: "متوسطة (Medium)" },
  { value: "bright", label: "ساطعة (Bright)" },
];

const lightingDirectionOptions: SelectOption[] = [
  { value: "front", label: "أمامي (Front)" },
  { value: "side", label: "جانبي (Side)" },
  { value: "top", label: "علوي (Top)" },
  { value: "back-soft", label: "خلفي ناعم (Soft back)" },
];

const colorTemperatureOptions: SelectOption[] = [
  { value: "warm", label: "دافئة (Warm)" },
  { value: "neutral", label: "محايدة (Neutral)" },
  { value: "cool", label: "باردة (Cool)" },
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
  { value: "side-part", label: "مفرق جانبي (Side part)" },
  { value: "slicked-back", label: "مرفوع للخلف (Slicked back)" },
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
  { value: "on-keyboard", label: "على لوحة المفاتيح (On keyboard)" },
  { value: "holding-cloth", label: "تحمل قطعة قماش (Holding cloth)" },
];

const handFingersStateOptions: SelectOption[] = [
  { value: "relaxed", label: "مسترخية (Relaxed)" },
  { value: "slightly-curled", label: "ملتفة قليلاً (Slightly curled)" },
  { value: "gripping-soft", label: "قابضة برفق (Soft grip)" },
];

const handVisibilityOptions: SelectOption[] = [
  { value: "fully-visible", label: "ظاهرة بالكامل (Fully visible)" },
  { value: "partially-visible", label: "ظاهرة جزئياً (Partially)" },
  { value: "off-frame", label: "خارج الإطار (Off-frame)" },
];

const handPlacementOptions: SelectOption[] = [
  { value: "at-side", label: "بجانب الجسم (At side)" },
  { value: "holding-phone", label: "تساند الهاتف (Holding phone)" },
  { value: "touching-hair", label: "تلامس الشعر (Touching hair)" },
  { value: "on-lap", label: "على الحضن (On lap)" },
  { value: "in-pocket", label: "في الجيب (In pocket)" },
];

function resolveLockedState(state: SceneState): SceneState {
  let resolved = { ...state };
  let changed = true;
  let pass = 0;

  while (changed && pass < constraintFields.length) {
    changed = false;
    pass += 1;

    for (const field of constraintFields) {
      const constraints = getFieldConstraints(field, resolved);
      if (constraints?.lockedTo === undefined) continue;

      const lockedValue =
        field === "roomHasBed"
          ? constraints.lockedTo === "true"
          : constraints.lockedTo;

      if (String(resolved[field]) !== String(lockedValue)) {
        resolved = { ...resolved, [field]: lockedValue } as SceneState;
        changed = true;
      }
    }
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
  const currentValue = lockedTo ?? String(state[field] ?? "");

  return (
    <label className={`grid gap-2 ${className}`} htmlFor={id}>
      <span className="flex items-center gap-2">
        {lockedTo !== undefined && <span aria-hidden="true">🔒</span>}
        <span>{label}</span>
      </span>
      <select
        id={id}
        value={currentValue}
        disabled={lockedTo !== undefined}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {options.map((option) => {
          const optionConstraint = constraints?.options.find(
            (item) => item.value === option.value,
          );
          const disabled = optionConstraint?.disabled ?? false;
          const reason = optionConstraint?.reason;

          return (
            <option key={option.value} value={option.value} disabled={disabled}>
              {option.label}
              {disabled && reason ? ` (${reason})` : ""}
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

function SmartCheckbox({
  id,
  field,
  state,
  onChange,
  label,
  className = "",
}: SmartCheckboxProps) {
  const constraints = getFieldConstraints(field, state);
  const lockedTo = constraints?.lockedTo;
  const lockedValue =
    lockedTo === "true" ? true : lockedTo === "false" ? false : undefined;
  const checked = lockedValue ?? Boolean(state[field]);

  return (
    <div className={`grid gap-2 ${className}`}>
      <label
        className="flex items-center gap-3 rounded-lg border border-white/20 bg-slate-900 p-3"
        htmlFor={id}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={lockedValue !== undefined}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
        />
        {lockedValue !== undefined && <span aria-hidden="true">🔒</span>}
        <span>{label}</span>
      </label>
      {lockedValue !== undefined && constraints?.lockReason && (
        <span className="text-xs leading-5 text-amber-300">
          ↳ {constraints.lockReason}
        </span>
      )}
    </div>
  );
}

function SmartTextarea({
  id,
  field,
  state,
  onChange,
  label,
  placeholder,
  className = "",
}: SmartTextareaProps) {
  const constraints = getFieldConstraints(field, state);
  const lockedTo = constraints?.lockedTo;
  const value = lockedTo ?? String(state[field] ?? "");

  return (
    <label className={`grid gap-2 ${className}`} htmlFor={id}>
      <span className="flex items-center gap-2">
        {lockedTo !== undefined && <span aria-hidden="true">🔒</span>}
        <span>{label}</span>
      </span>
      <textarea
        id={id}
        value={value}
        disabled={lockedTo !== undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={200}
        className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
      />
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

  function handleScenarioChange(id: SceneState["scenario"]) {
    setState((current) => {
      if (id === "none") return { ...current, scenario: "none" };
      const preset = SCENARIOS.find((item) => item.id === id);
      return preset ? { ...preset.apply(current), scenario: id } : current;
    });
  }

  const englishPrompt = buildPromptEnglish(resolvedState);
  const arabicPrompt = buildPromptArabic(resolvedState);
  const negativePrompt = buildNegativePrompt(resolvedState);
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
  const scenarioOptions: SelectOption[] = [
    { value: "none", label: "بدون سيناريو (None)" },
    ...SCENARIOS.map((scenario) => ({
      value: scenario.id ?? "none",
      label: `${scenario.labelAr} (${scenario.labelEn})`,
    })),
  ];

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6"
    >
      <div className="mx-auto max-w-2xl">
        <header className="px-1 pb-6">
          <h1 className="text-4xl font-bold">Ton</h1>
          <p className="mt-4 text-slate-300">
            صفحة واحدة ذكية لبناء مشهد سيلفي متوافق، مع إظهار القيود والأقفال
            مباشرة أثناء الاختيار.
          </p>

          <div className="mt-6">
            <SmartSelect
              id="scenario"
              field="scenario"
              state={resolvedState}
              label="سيناريو جاهز"
              options={scenarioOptions}
              onChange={(value) =>
                handleScenarioChange(value as SceneState["scenario"])
              }
            />
          </div>
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
            <SmartCheckbox
              id="reference-provided"
              field="referenceProvided"
              state={resolvedState}
              label="لدي صورة مرجعية"
              onChange={(value) => updateField("referenceProvided", value)}
              className="sm:col-span-2"
            />
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
            <SmartTextarea
              id="identity-notes"
              field="identityNotes"
              state={resolvedState}
              label="ملاحظات عن الملامح (اختياري)"
              placeholder="مثال: شعر قصير، حاجب رقيق، عيون واسعة"
              onChange={(value) => updateField("identityNotes", value)}
              className="sm:col-span-2"
            />
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200 sm:col-span-2">
              لا ترفع صور أشخاص آخرين بدون موافقتهم. لا تستخدم النظام لانتحال
              الهوية أو التضليل. في هذه المرحلة، لا يتم رفع أي صورة فعلياً، فقط
              تُحفظ اختياراتك محلياً في المتصفح.
            </p>
          </CollapsibleSection>

          <CollapsibleSection title="الغرفة والخلفية" badge="4 حقول">
            <SmartSelect
              id="room-type"
              field="roomType"
              state={resolvedState}
              label="نوع الغرفة"
              options={roomTypeOptions}
              onChange={(value) =>
                updateField("roomType", value as SceneState["roomType"])
              }
            />
            <SmartSelect
              id="room-cleanliness"
              field="roomCleanliness"
              state={resolvedState}
              label="ترتيب الغرفة"
              options={roomCleanlinessOptions}
              onChange={(value) =>
                updateField(
                  "roomCleanliness",
                  value as SceneState["roomCleanliness"],
                )
              }
            />
            <SmartSelect
              id="room-window"
              field="roomWindow"
              state={resolvedState}
              label="حجم النافذة"
              options={roomWindowOptions}
              onChange={(value) =>
                updateField("roomWindow", value as SceneState["roomWindow"])
              }
            />
            <SmartCheckbox
              id="room-has-bed"
              field="roomHasBed"
              state={resolvedState}
              label="يوجد سرير (Bed)"
              onChange={(value) => updateField("roomHasBed", value)}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="الإضاءة الواقعية"
            badge="4 حقول"
            defaultOpen
          >
            <SmartSelect
              id="lighting-source"
              field="lightingSource"
              state={resolvedState}
              label="مصدر الإضاءة"
              options={lightingSourceOptions}
              onChange={(value) =>
                updateField(
                  "lightingSource",
                  value as SceneState["lightingSource"],
                )
              }
            />
            <SmartSelect
              id="lighting-intensity"
              field="lightingIntensity"
              state={resolvedState}
              label="شدة الإضاءة"
              options={lightingIntensityOptions}
              onChange={(value) =>
                updateField(
                  "lightingIntensity",
                  value as SceneState["lightingIntensity"],
                )
              }
            />
            <SmartSelect
              id="lighting-direction"
              field="lightingDirection"
              state={resolvedState}
              label="اتجاه الضوء"
              options={lightingDirectionOptions}
              onChange={(value) =>
                updateField(
                  "lightingDirection",
                  value as SceneState["lightingDirection"],
                )
              }
            />
            <SmartSelect
              id="color-temperature"
              field="colorTemperature"
              state={resolvedState}
              label="حرارة اللون"
              options={colorTemperatureOptions}
              onChange={(value) =>
                updateField(
                  "colorTemperature",
                  value as SceneState["colorTemperature"],
                )
              }
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

          <CollapsibleSection title="اليد الحرة" badge="3 حقول">
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

          <CollapsibleSection title="خيارات متقدمة" badge="1 حقل">
            <SmartSelect
              id="hand-placement"
              field="handPlacement"
              state={resolvedState}
              label="موضع اليد العام"
              options={handPlacementOptions}
              onChange={(value) =>
                updateField(
                  "handPlacement",
                  value as SceneState["handPlacement"],
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
                onKeyDown={(event) => {
                  const offset =
                    event.key === "ArrowRight"
                      ? -1
                      : event.key === "ArrowLeft"
                        ? 1
                        : 0;
                  if (!offset) return;
                  event.preventDefault();
                  const index = previewTabs.findIndex((tab) => tab.id === id);
                  const next =
                    previewTabs[
                      (index + offset + previewTabs.length) % previewTabs.length
                    ].id;
                  setActiveTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }}
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
