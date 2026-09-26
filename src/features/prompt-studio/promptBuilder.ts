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

const clothingTopLabels: Record<SceneState["clothingTop"], string> = {
  // تي شيرت.
  "t-shirt": "تي شيرت",
  // قميص.
  shirt: "قميص",
  // هودي.
  hoodie: "هودي",
  // بلوزة نوم.
  "pajama-top": "بلوزة نوم",
  // كنزة.
  sweater: "كنزة",
  // قميص بلا أكمام.
  "tank-top": "قميص بلا أكمام",
};

const clothingBottomLabels: Record<SceneState["clothingBottom"], string> = {
  // بنطال جينز.
  jeans: "بنطال جينز",
  // شورت.
  shorts: "شورت",
  // بنطال نوم.
  "pajama-pants": "بنطال نوم",
  // بنطال رياضي.
  sweatpants: "بنطال رياضي",
  // خارج الإطار.
  "none-visible": "غير ظاهرة في الإطار",
};

const clothingMaterialLabels: Record<SceneState["clothingMaterial"], string> = {
  // قطن.
  cotton: "قطن",
  // دنيم.
  denim: "دنيم",
  // صوف.
  wool: "صوف",
  // بوليستر.
  polyester: "بوليستر",
  // كتان.
  linen: "كتان",
};

const clothingColorLabels: Record<SceneState["clothingColor"], string> = {
  // ألوان محايدة.
  neutral: "محايدة",
  // ألوان داكنة.
  dark: "داكنة",
  // ألوان فاتحة.
  light: "فاتحة",
  // ألوان ترابية.
  "earth-tone": "ترابية",
  // ألوان باستيل.
  pastel: "باستيل",
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

const arabicIdentityPriorities: Record<SceneState["identityPriority"], string> =
  {
    strict: "حافظ على هوية الشخص من الصورة المرجعية بأولوية قصوى",
    balanced:
      "حافظ على هوية الشخص من الصورة المرجعية، مع توازن مع مرونة المشهد",
    flexible: "حافظ على هوية الشخص بشكل مرن، مع السماح بتعديلات على المشهد",
  };

export function buildPromptArabic(state: SceneState): string {
  const identityDescription = state.referenceProvided
    ? `${arabicIdentityPriorities[state.identityPriority]}. `
    : "";
  const notes = state.identityNotes.trim();
  const identityNotesDescription = notes
    ? ` ملاحظات إضافية عن الهوية: ${notes}.`
    : "";
  const bedDescription = state.roomHasBed ? "، مع سرير مرتب في الخلفية" : "";
  let lightingSourceDescription = lightingSources[state.lightingSource];
  if (!state.roomHasBed && state.lightingSource === "bedside-lamp") {
    lightingSourceDescription = "مصباح جانبي";
  } else if (
    state.roomWindow === "none" &&
    state.lightingSource === "window-day"
  ) {
    lightingSourceDescription = "ضوء النهار";
  } else if (
    state.roomWindow === "none" &&
    state.lightingSource === "window-sunset"
  ) {
    lightingSourceDescription = "ضوء الغروب";
  }

  return `${identityDescription}لقطة ${shotTypes[state.shotType]}. الكاميرا ${cameraDistances[state.cameraDistance]}، وزاويتها ${cameraAngles[state.cameraAngle]}. الغرفة ${roomTypes[state.roomType]}، ${roomCleanlinessLabels[state.roomCleanliness]}، ${roomWindowLabels[state.roomWindow]}${bedDescription}. الملابس: القطعة العلوية ${clothingTopLabels[state.clothingTop]}، والقطعة السفلية ${clothingBottomLabels[state.clothingBottom]}، ومادة القماش ${clothingMaterialLabels[state.clothingMaterial]}، وفئة اللون ${clothingColorLabels[state.clothingColor]}. مصدر الإضاءة ${lightingSourceDescription} وشدتها ${lightingIntensities[state.lightingIntensity]}، واتجاه الضوء ${lightingDirections[state.lightingDirection]}، وحرارة اللون ${colorTemperatures[state.colorTemperature]}.${identityNotesDescription}`;
}

const englishShotTypes: Record<SceneState["shotType"], string> = {
  "front-selfie": "front-camera selfie",
  "mirror-selfie": "mirror selfie",
};

const englishCameraDistances: Record<SceneState["cameraDistance"], string> = {
  close: "close to the face",
  "arm-length": "at arm's length",
  extended: "with an extended arm",
};

const englishCameraAngles: Record<SceneState["cameraAngle"], string> = {
  "eye-level": "eye level",
  "slightly-above": "slightly above eye level",
  "slightly-below": "slightly below eye level",
};

const englishRoomTypes: Record<SceneState["roomType"], string> = {
  simple: "simple",
  modern: "modern",
  small: "small",
  medium: "medium-sized",
};

const englishRoomCleanliness: Record<SceneState["roomCleanliness"], string> = {
  "very-tidy": "very tidy",
  natural: "naturally lived-in",
  "light-mess": "slightly messy",
  "moderate-mess": "moderately messy",
};

const englishRoomWindows: Record<SceneState["roomWindow"], string> = {
  none: "no window",
  small: "a small window",
  medium: "a medium-sized window",
  large: "a large window",
};

const englishClothingTops: Record<SceneState["clothingTop"], string> = {
  "t-shirt": "T-shirt",
  shirt: "shirt",
  hoodie: "hoodie",
  "pajama-top": "pajama top",
  sweater: "sweater",
  "tank-top": "tank top",
};

const englishClothingBottoms: Record<SceneState["clothingBottom"], string> = {
  jeans: "jeans",
  shorts: "shorts",
  "pajama-pants": "pajama pants",
  sweatpants: "sweatpants",
  "none-visible": "not visible in the frame",
};

const englishClothingMaterials: Record<SceneState["clothingMaterial"], string> =
  {
    cotton: "cotton",
    denim: "denim",
    wool: "wool",
    polyester: "polyester",
    linen: "linen",
  };

const englishClothingColors: Record<SceneState["clothingColor"], string> = {
  neutral: "neutral",
  dark: "dark",
  light: "light",
  "earth-tone": "earth",
  pastel: "pastel",
};

const englishLightingSources: Record<SceneState["lightingSource"], string> = {
  "window-day": "daylight from the window",
  "window-sunset": "sunset light from the window",
  ceiling: "ceiling light",
  "bedside-lamp": "bedside lamp light",
};

const englishLightingIntensities: Record<
  SceneState["lightingIntensity"],
  string
> = {
  dim: "dim",
  soft: "soft",
  medium: "moderate",
  bright: "bright",
};

const englishLightingDirections: Record<
  SceneState["lightingDirection"],
  string
> = {
  front: "from the front",
  side: "from the side",
  top: "from above",
  "back-soft": "softly from behind",
};

const englishColorTemperatures: Record<SceneState["colorTemperature"], string> =
  {
    warm: "warm",
    neutral: "neutral",
    cool: "cool",
  };

const englishIdentityPriorities: Record<
  SceneState["identityPriority"],
  string
> = {
  strict:
    "Preserve the subject's identity from the reference image with strict priority",
  balanced:
    "Preserve the subject's identity from the reference image, balanced with scene flexibility",
  flexible:
    "Preserve the subject's identity loosely, allowing scene adjustments",
};

export function buildPromptEnglish(state: SceneState): string {
  const identityDescription = state.referenceProvided
    ? `${englishIdentityPriorities[state.identityPriority]}. `
    : "";
  const notes = state.identityNotes.trim();
  const identityNotesDescription = notes
    ? ` Additional identity notes: ${notes}.`
    : "";
  const windowDescription = englishRoomWindows[state.roomWindow];
  const bedDescription = state.roomHasBed
    ? ", with a neatly made bed in the background"
    : "";
  const bottomDescription =
    state.clothingBottom === "none-visible"
      ? ", with the lower garment outside the frame"
      : ` and ${englishClothingBottoms[state.clothingBottom]}`;
  let lightingSource = englishLightingSources[state.lightingSource];
  if (!state.roomHasBed && state.lightingSource === "bedside-lamp") {
    lightingSource = "side lamp light";
  } else if (
    state.roomWindow === "none" &&
    state.lightingSource === "window-day"
  ) {
    lightingSource = "daylight";
  } else if (
    state.roomWindow === "none" &&
    state.lightingSource === "window-sunset"
  ) {
    lightingSource = "sunset light";
  }

  return `${identityDescription}A ${englishShotTypes[state.shotType]} taken ${englishCameraDistances[state.cameraDistance]} from ${englishCameraAngles[state.cameraAngle]} in a ${englishRoomTypes[state.roomType]} bedroom that is ${englishRoomCleanliness[state.roomCleanliness]}, with ${windowDescription}${bedDescription}; the subject wears a ${englishClothingMaterials[state.clothingMaterial]} ${englishClothingTops[state.clothingTop]}${bottomDescription} in ${englishClothingColors[state.clothingColor]} tones; lighting is ${englishLightingIntensities[state.lightingIntensity]} ${lightingSource}, ${englishLightingDirections[state.lightingDirection]}, with a ${englishColorTemperatures[state.colorTemperature]} color temperature.${identityNotesDescription}`;
}

export function buildNegativePrompt(state: SceneState): string {
  const constraints = [
    "no AI-looking artifacts",
    "no watermark",
    "no text artifacts",
    "no distorted face; no waxy skin; no plastic skin",
    "no extra fingers; no malformed hands",
    "no unrealistic lighting; no excessive HDR",
  ];

  if (state.shotType === "mirror-selfie") {
    constraints.push("no incorrect reflections; no mirrored text");
  }

  if (state.roomHasBed) {
    constraints.push("no warped furniture");
  }

  if (state.lightingIntensity === "bright") {
    constraints.push("no blown highlights");
  }

  if (state.lightingIntensity === "dim") {
    constraints.push("no excessive noise reduction");
  }

  return constraints.join(", ");
}
