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
                  setState((current) => ({
                    ...current,
                    referenceProvided: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-amber-300"
              />
              لدي صورة مرجعية
            </label>

            <label
              className="grid gap-2 sm:col-span-2"
              htmlFor="identity-priority"
            >
              أولوية الحفاظ على الهوية
              <select
                id="identity-priority"
                value={state.identityPriority}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    identityPriority: event.target
                      .value as SceneState["identityPriority"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="strict">قصوى (Strict)</option>
                <option value="balanced">متوازنة (Balanced)</option>
                <option value="flexible">مرنة (Flexible)</option>
              </select>
            </label>

            <label
              className="grid gap-2 sm:col-span-2"
              htmlFor="identity-notes"
            >
              ملاحظات عن الملامح (اختياري)
              <textarea
                id="identity-notes"
                value={state.identityNotes}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    identityNotes: event.target.value,
                  }))
                }
                placeholder="مثال: شعر قصير، حاجب رقيق، عيون واسعة"
                rows={3}
                maxLength={200}
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              />
            </label>

            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200 sm:col-span-2">
              لا ترفع صور أشخاص آخرين بدون موافقتهم. لا تستخدم النظام لانتحال
              الهوية أو التضليل. في هذه المرحلة، لا يتم رفع أي صورة فعلياً — فقط
              تُحفظ اختياراتك محلياً في المتصفح.
            </p>
          </CollapsibleSection>

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

          <CollapsibleSection title="الشعر" badge="3 حقول">
            <label className="grid gap-2" htmlFor="hair-style">
              التسريحة
              <select
                id="hair-style"
                value={state.hairStyle}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    hairStyle: event.target.value as SceneState["hairStyle"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="natural">طبيعي (Natural)</option>
                <option value="combed">ممشط (Combed)</option>
                <option value="messy-light">فوضوي خفيف (Light messy)</option>
                <option value="side-part">مفرق جانبي (Side part)</option>
                <option value="slicked-back">مرفوع للخلف (Slicked back)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="hair-length">
              الطول
              <select
                id="hair-length"
                value={state.hairLength}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    hairLength: event.target.value as SceneState["hairLength"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="short">قصير (Short)</option>
                <option value="medium">متوسط (Medium)</option>
                <option value="long">طويل (Long)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="hair-texture">
              الملمس
              <select
                id="hair-texture"
                value={state.hairTexture}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    hairTexture: event.target
                      .value as SceneState["hairTexture"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="straight">أملس (Straight)</option>
                <option value="wavy">مموج (Wavy)</option>
                <option value="curly">مجعد (Curly)</option>
              </select>
            </label>
          </CollapsibleSection>

          <CollapsibleSection title="الوضعية" badge="5 حقول">
            <label className="grid gap-2" htmlFor="pose-type">
              الوضعية
              <select
                id="pose-type"
                value={state.poseType}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    poseType: event.target.value as SceneState["poseType"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="standing">وقوف (Standing)</option>
                <option value="sitting-bed">
                  جلوس على السرير (Sitting on bed)
                </option>
                <option value="sitting-chair">
                  جلوس على كرسي (Sitting on chair)
                </option>
                <option value="lying-bed">
                  استلقاء على السرير (Lying on bed)
                </option>
                <option value="standing-window">
                  وقوف قرب النافذة (Standing by window)
                </option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="head-direction">
              اتجاه الرأس
              <select
                id="head-direction"
                value={state.headDirection}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    headDirection: event.target
                      .value as SceneState["headDirection"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="forward">للأمام (Forward)</option>
                <option value="slightly-left">
                  يساراً قليلاً (Slightly left)
                </option>
                <option value="slightly-right">
                  يميناً قليلاً (Slightly right)
                </option>
                <option value="down">للأسفل (Down)</option>
                <option value="up-soft">لأعلى برفق (Gently up)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="shoulder-position">
              وضعية الكتفين
              <select
                id="shoulder-position"
                value={state.shoulderPosition}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    shoulderPosition: event.target
                      .value as SceneState["shoulderPosition"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="relaxed">مسترخيان (Relaxed)</option>
                <option value="one-raised">
                  كتف مرتفع قليلاً (One raised)
                </option>
                <option value="both-back">للخلف (Both back)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="hand-placement">
              اليد الحرة
              <select
                id="hand-placement"
                value={state.handPlacement}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    handPlacement: event.target
                      .value as SceneState["handPlacement"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="at-side">بجانب الجسم (At side)</option>
                <option value="holding-phone">
                  تساند الهاتف (Holding phone)
                </option>
                <option value="touching-hair">
                  تلمس الشعر (Touching hair)
                </option>
                <option value="on-lap">على الحضن (On lap)</option>
                <option value="in-pocket">في الجيب (In pocket)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="back-posture">
              وضعية الظهر
              <select
                id="back-posture"
                value={state.backPosture}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    backPosture: event.target
                      .value as SceneState["backPosture"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="straight">مستقيم (Straight)</option>
                <option value="relaxed">مسترخٍ (Relaxed)</option>
                <option value="slightly-leaning">
                  مائل قليلاً (Slightly leaning)
                </option>
              </select>
            </label>
          </CollapsibleSection>

          <CollapsibleSection title="تعابير الوجه" badge="3 حقول">
            <label className="grid gap-2" htmlFor="face-expression">
              تعبير الوجه
              <select
                id="face-expression"
                value={state.faceExpression}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    faceExpression: event.target
                      .value as SceneState["faceExpression"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="neutral">محايد طبيعي (Neutral)</option>
                <option value="soft-smile">ابتسامة خفيفة (Soft smile)</option>
                <option value="closed-smile">
                  ابتسامة مغلقة (Closed smile)
                </option>
                <option value="calm-focus">تركيز هادئ (Calm focus)</option>
                <option value="side-glance">نظرة جانبية (Side glance)</option>
                <option value="thinking">تفكير (Thinking)</option>
                <option value="sleepy">نعاس خفيف (Sleepy)</option>
                <option value="light-laugh">ضحكة خفيفة (Light laugh)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="eye-direction">
              اتجاه النظر
              <select
                id="eye-direction"
                value={state.eyeDirection}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    eyeDirection: event.target
                      .value as SceneState["eyeDirection"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="camera">نحو الكاميرا (Camera)</option>
                <option value="mirror">نحو المرآة (Mirror)</option>
                <option value="away-soft">بعيداً بلطف (Away)</option>
                <option value="down-soft">للأسفل بلطف (Down)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="mouth-state">
              حالة الفم
              <select
                id="mouth-state"
                value={state.mouthState}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    mouthState: event.target.value as SceneState["mouthState"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="closed">مغلق (Closed)</option>
                <option value="slightly-open">
                  مفتوح قليلاً (Slightly open)
                </option>
                <option value="smile-closed">
                  ابتسامة مغلقة (Smile closed)
                </option>
                <option value="smile-open-light">
                  ابتسامة مفتوحة خفيفة (Light open smile)
                </option>
              </select>
            </label>
          </CollapsibleSection>

          <CollapsibleSection title="اليد الحرة" badge="3 حقول">
            <label className="grid gap-2" htmlFor="free-hand-position">
              موقع اليد الحرة
              <select
                id="free-hand-position"
                value={state.freeHandPosition}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    freeHandPosition: event.target.value as SceneState["freeHandPosition"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="at-side">بجانب الجسم (At side)</option>
                <option value="on-hair">على الشعر (On hair)</option>
                <option value="holding-cup">تحمل كوباً (Holding cup)</option>
                <option value="touching-chin">تلمس الذقن (Touching chin)</option>
                <option value="in-pocket">في الجيب (In pocket)</option>
                <option value="on-bed">على السرير (On bed)</option>
                <option value="on-keyboard">على لوحة المفاتيح (On keyboard)</option>
                <option value="holding-cloth">تحمل قطعة قماش (Holding cloth)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="hand-fingers-state">
              حالة الأصابع
              <select
                id="hand-fingers-state"
                value={state.handFingersState}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    handFingersState: event.target.value as SceneState["handFingersState"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="relaxed">مسترخية (Relaxed)</option>
                <option value="slightly-curled">ملتفة قليلاً (Slightly curled)</option>
                <option value="gripping-soft">قابضة برفق (Soft grip)</option>
              </select>
            </label>

            <label className="grid gap-2" htmlFor="hand-visibility">
              ظهور اليد في الإطار
              <select
                id="hand-visibility"
                value={state.handVisibility}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    handVisibility: event.target.value as SceneState["handVisibility"],
                  }))
                }
                className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
              >
                <option value="fully-visible">ظاهرة بالكامل (Fully visible)</option>
                <option value="partially-visible">ظاهرة جزئياً (Partially)</option>
                <option value="off-frame">خارج الإطار (Off-frame)</option>
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
