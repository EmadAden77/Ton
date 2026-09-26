import type { SceneState } from "./types";

const shotTypes: Record<SceneState["shotType"], string> = {
  // سيلفي بالكاميرا الأمامية.
  "front-selfie": "سيلفي بالكاميرا الأمامية",
  // سيلفي أمام المرآة.
  "mirror-selfie": "سيلفي أمام المرآة",
};

const cameraDistances: Record<SceneState["cameraDistance"], string> = {
  // الكاميرا قريبة من الوجه.
  close: "قريبة من الوجه",
  // الكاميرا عند طول الذراع.
  "arm-length": "عند طول الذراع",
  // الكاميرا عند امتداد الذراع.
  extended: "عند امتداد الذراع",
};

const cameraAngles: Record<SceneState["cameraAngle"], string> = {
  // الكاميرا بمستوى العين.
  "eye-level": "بمستوى العين",
  // الكاميرا أعلى من العين قليلاً.
  "slightly-above": "أعلى من مستوى العين قليلاً",
  // الكاميرا أسفل العين قليلاً.
  "slightly-below": "أسفل من مستوى العين قليلاً",
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

const roomCleanlinessLabels: Record<SceneState["roomCleanliness"], string> = {
  // غرفة مرتبة جداً.
  "very-tidy": "مرتبة جداً",
  // ترتيب يومي طبيعي.
  natural: "بترتيب طبيعي",
  // فوضى خفيفة.
  "light-mess": "بفوضى خفيفة",
  // فوضى متوسطة.
  "moderate-mess": "بفوضى متوسطة",
};

const roomWindowLabels: Record<SceneState["roomWindow"], string> = {
  // بلا نافذة.
  none: "بلا نافذة",
  // نافذة صغيرة.
  small: "بنافذة صغيرة",
  // نافذة متوسطة.
  medium: "بنافذة متوسطة",
  // نافذة كبيرة.
  large: "بنافذة كبيرة",
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

const lightingDirections: Record<SceneState["lightingDirection"], string> = {
  // الضوء من الأمام.
  front: "من الأمام",
  // الضوء من الجانب.
  side: "من الجانب",
  // الضوء من الأعلى.
  top: "من الأعلى",
  // الضوء ناعم من الخلف.
  "back-soft": "ناعم من الخلف",
};

const colorTemperatures: Record<SceneState["colorTemperature"], string> = {
  // لون دافئ.
  warm: "دافئة",
  // لون محايد.
  neutral: "محايدة",
  // لون بارد.
  cool: "باردة",
};

export function buildPromptArabic(state: SceneState): string {
  const bedDescription = state.roomHasBed ? "، مع سرير مرتب في الخلفية" : "";
  const lightingSourceDescription =
    !state.roomHasBed && state.lightingSource === "bedside-lamp"
      ? "مصباح جانبي"
      : lightingSources[state.lightingSource];

  return `لقطة ${shotTypes[state.shotType]}. الكاميرا ${cameraDistances[state.cameraDistance]}، وزاويتها ${cameraAngles[state.cameraAngle]}. الغرفة ${roomTypes[state.roomType]}، ${roomCleanlinessLabels[state.roomCleanliness]}، ${roomWindowLabels[state.roomWindow]}${bedDescription}. مصدر الإضاءة ${lightingSourceDescription} وشدتها ${lightingIntensities[state.lightingIntensity]}، واتجاه الضوء ${lightingDirections[state.lightingDirection]}، وحرارة اللون ${colorTemperatures[state.colorTemperature]}.`;
}
