import type { SceneState } from "./types";

const shotTypes: Record<SceneState["shotType"], string> = {
  // سيلفي بالكاميرا الأمامية.
  "front-selfie": "سيلفي بالكاميرا الأمامية",
  // سيلفي أمام المرآة.
  "mirror-selfie": "سيلفي أمام المرآة",
};

const roomTypes: Record<SceneState["roomType"], string> = {
  // غرفة بسيطة.
  simple: "بسيطة",
  // غرفة حديثة.
  modern: "حديثة",
  // غرفة صغيرة.
  small: "صغيرة",
  // غرفة متوسطة الحجم.
  medium: "متوسطة الحجم",
};

const lightingSources: Record<SceneState["lightingSource"], string> = {
  // ضوء النهار من النافذة.
  "window-day": "ضوء النهار من النافذة",
  // ضوء الغروب من النافذة.
  "window-sunset": "ضوء الغروب من النافذة",
  // إنارة السقف.
  ceiling: "إنارة السقف",
  // مصباح بجانب السرير.
  "bedside-lamp": "مصباح بجانب السرير",
};

const lightingIntensities: Record<SceneState["lightingIntensity"], string> = {
  // إضاءة خافتة.
  dim: "خافتة",
  // إضاءة ناعمة.
  soft: "ناعمة",
  // إضاءة متوسطة.
  medium: "متوسطة",
  // إضاءة ساطعة.
  bright: "ساطعة",
};

export function buildPromptArabic(state: SceneState): string {
  return `لقطة ${shotTypes[state.shotType]}. الغرفة ${roomTypes[state.roomType]}. مصدر الإضاءة ${lightingSources[state.lightingSource]} وشدتها ${lightingIntensities[state.lightingIntensity]}.`;
}
