"use client";

import Link from "next/link";
import { useState } from "react";
import { Camera, Copy, RotateCcw } from "lucide-react";

import {
  ThreeDSceneCanvas,
  type ThreeDViewMode,
} from "@/features/prompt-studio/components/ThreeDSceneCanvas";
import { SmartSelect } from "@/features/prompt-studio/components/SmartSelect";
import {
  legConfigurationOptions,
  pelvisOrientationOptions,
  torsoLeanOptions,
  weightDistributionOptions,
} from "@/features/prompt-studio/microPose";
import {
  cameraAngleOptions,
  cameraDistanceOptions,
} from "@/features/prompt-studio/options";
import {
  buildNegativePrompt,
  buildPromptEnglish,
} from "@/features/prompt-studio/promptBuilder";
import {
  createDefaultSceneState,
  resolveLockedState,
} from "@/features/prompt-studio/state";
import {
  getThreeDPose,
  selectThreeDLighting,
  selectThreeDPose,
  THREE_D_LIGHTING,
  THREE_D_POSES,
} from "@/features/prompt-studio/threeDScene";
import type { SceneState } from "@/features/prompt-studio/types";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"simulator" | "prompt">(
    "simulator",
  );
  const [viewMode, setViewMode] = useState<ThreeDViewMode>("viewer");
  const [copiedTarget, setCopiedTarget] = useState<
    "prompt" | "negative" | null
  >(null);
  const [sceneState, setSceneState] = useState<SceneState>(() =>
    createDefaultSceneState(),
  );

  const pose = getThreeDPose(sceneState.poseType);
  const englishPrompt = buildPromptEnglish(sceneState);
  const negativePrompt = buildNegativePrompt(sceneState);

  const selectPose = (poseType: SceneState["poseType"]) => {
    setSceneState((previous) => selectThreeDPose(previous, poseType));
  };

  const selectLighting = (lightingMode: SceneState["lightingMode"]) => {
    setSceneState((previous) => selectThreeDLighting(previous, lightingMode));
  };

  const selectCameraDistance = (value: string) => {
    setSceneState((previous) =>
      resolveLockedState({
        ...previous,
        cameraDistance: value as SceneState["cameraDistance"],
      }),
    );
  };

  const selectCameraAngle = (value: string) => {
    setSceneState((previous) =>
      resolveLockedState({
        ...previous,
        cameraAngle: value as SceneState["cameraAngle"],
      }),
    );
  };

  const selectMicroPose = <
    K extends
      | "legConfiguration"
      | "torsoLean"
      | "pelvisOrientation"
      | "weightDistribution",
  >(
    field: K,
    value: SceneState[K],
  ) => {
    setSceneState((previous) =>
      resolveLockedState({ ...previous, [field]: value }),
    );
  };

  const reset = () => {
    setViewMode("viewer");
    setSceneState(createDefaultSceneState());
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(englishPrompt);
    setCopiedTarget("prompt");
    window.setTimeout(() => setCopiedTarget(null), 1200);
  };

  const copyNegative = async () => {
    await navigator.clipboard.writeText(negativePrompt);
    setCopiedTarget("negative");
    window.setTimeout(() => setCopiedTarget(null), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100" dir="rtl">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 p-1.5">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold">محاكي السيلفي 3D</h1>
            <p className="text-[10px] text-slate-500">
              Viewer مستقل + كاميرا سيلفي مشتقة من SceneState
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-slate-300 transition hover:border-amber-500/60 hover:text-amber-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          إعادة التعيين
        </button>
      </header>

      <main>
        <div style={{ display: activeTab === "simulator" ? "block" : "none" }}>
          <section className="h-[60vh] min-h-[380px] border-b border-slate-800 bg-black">
            <ThreeDSceneCanvas sceneState={sceneState} viewMode={viewMode} />
          </section>

          <section className="space-y-5 px-3 py-4">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-200">
                  طريقة العرض
                </h2>
                <span className="text-[10px] text-slate-500">
                  لا تغيّر SceneState
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["viewer", "مشاهد الغرفة"],
                    ["selfie", "كاميرا السيلفي"],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                      viewMode === mode
                        ? "border-cyan-500/70 bg-cyan-500/15 text-cyan-300"
                        : "border-slate-800 bg-slate-900 text-slate-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {viewMode === "selfie" ? (
                <p className="mt-2 text-[11px] leading-5 text-slate-500">
                  هذا منظور تقريبي لاختبار الهندسة والتكوين، وليس معايرة بصرية
                  دقيقة لعدسة هاتف بعينه.
                </p>
              ) : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-200">الوضعية</h2>
                <span className="text-[10px] text-slate-500">
                  {THREE_D_POSES.length} وضعيات
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {THREE_D_POSES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectPose(item.id)}
                    className={`rounded-xl border px-3 py-3 text-right text-sm font-semibold transition ${
                      pose.id === item.id
                        ? "border-amber-500/70 bg-amber-500/15 text-amber-300"
                        : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-200">
                  تفاصيل الوضعية الدقيقة
                </h2>
                <span className="text-[10px] text-slate-500">
                  مقيدة حسب الوضعية الأساسية
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SmartSelect
                  id="three-d-leg-configuration"
                  field="legConfiguration"
                  state={sceneState}
                  label="تكوين الساقين"
                  options={legConfigurationOptions}
                  onChange={(value) =>
                    selectMicroPose(
                      "legConfiguration",
                      value as SceneState["legConfiguration"],
                    )
                  }
                />
                <SmartSelect
                  id="three-d-torso-lean"
                  field="torsoLean"
                  state={sceneState}
                  label="ميل الجذع"
                  options={torsoLeanOptions}
                  onChange={(value) =>
                    selectMicroPose(
                      "torsoLean",
                      value as SceneState["torsoLean"],
                    )
                  }
                />
                <SmartSelect
                  id="three-d-pelvis-orientation"
                  field="pelvisOrientation"
                  state={sceneState}
                  label="اتجاه الحوض"
                  options={pelvisOrientationOptions}
                  onChange={(value) =>
                    selectMicroPose(
                      "pelvisOrientation",
                      value as SceneState["pelvisOrientation"],
                    )
                  }
                />
                <SmartSelect
                  id="three-d-weight-distribution"
                  field="weightDistribution"
                  state={sceneState}
                  label="توزيع الوزن"
                  options={weightDistributionOptions}
                  onChange={(value) =>
                    selectMicroPose(
                      "weightDistribution",
                      value as SceneState["weightDistribution"],
                    )
                  }
                />
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                معاينة Xbot تطبق ميل الجذع ودوران الحوض وانحياز الوزن على
                التحويل العام للجسم. تكوين الساقين يبقى joint hint دلالياً حتى
                إضافة إعادة تحريك هيكلية كاملة مستقبلاً.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-200">
                  هندسة الكاميرا
                </h2>
                <span className="text-[10px] text-slate-500">
                  نفس قيود Ton الرئيسية
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SmartSelect
                  id="three-d-camera-distance"
                  field="cameraDistance"
                  state={sceneState}
                  onChange={selectCameraDistance}
                  label="مسافة الكاميرا"
                  options={cameraDistanceOptions}
                />
                <SmartSelect
                  id="three-d-camera-angle"
                  field="cameraAngle"
                  state={sceneState}
                  onChange={selectCameraAngle}
                  label="زاوية الكاميرا"
                  options={cameraAngleOptions}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-200">الإضاءة</h2>
                <span className="text-[10px] text-slate-500">
                  نفس أوضاع Ton الرئيسية
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(THREE_D_LIGHTING).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectLighting(item.id)}
                    className={`rounded-xl border px-2 py-2 text-xs font-bold transition ${
                      sceneState.lightingMode === item.id
                        ? "border-amber-500/70 bg-amber-500/15 text-amber-300"
                        : "border-slate-800 bg-slate-900 text-slate-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div style={{ display: activeTab === "prompt" ? "block" : "none" }}>
          <section className="mx-auto min-h-[calc(100vh-8.5rem)] max-w-3xl space-y-6 px-4 py-5">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-200">
                  Prompt (English)
                </h2>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-amber-500/60 hover:text-amber-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedTarget === "prompt" ? "تم النسخ" : "نسخ"}
                </button>
              </div>
              <pre
                dir="ltr"
                className="max-h-[36vh] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left text-xs leading-relaxed text-slate-300"
              >
                {englishPrompt}
              </pre>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-200">
                  Negative Prompt
                </h2>
                <button
                  type="button"
                  onClick={copyNegative}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-amber-500/60 hover:text-amber-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedTarget === "negative" ? "تم النسخ" : "نسخ"}
                </button>
              </div>
              <pre
                dir="ltr"
                className="max-h-[28vh] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left text-xs leading-relaxed text-slate-300"
              >
                {negativePrompt}
              </pre>
            </div>

            <Link
              href="/"
              className="block w-full rounded-xl bg-amber-500 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-amber-600"
            >
              افتح في Ton الرئيسي
            </Link>
          </section>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <button
          type="button"
          onClick={() => setActiveTab("simulator")}
          className={`flex-1 border-t-2 py-3 text-sm font-bold transition ${
            activeTab === "simulator"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400"
          }`}
        >
          🎮 المحاكي
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("prompt")}
          className={`flex-1 border-t-2 py-3 text-sm font-bold transition ${
            activeTab === "prompt"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400"
          }`}
        >
          📝 Prompt
        </button>
      </nav>
    </div>
  );
}
