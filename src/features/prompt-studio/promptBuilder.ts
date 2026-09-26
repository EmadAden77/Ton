import type { SceneState } from "./types";

const FIXED_ROOM_DESCRIPTION_EN =
  "in a realistic modern bedroom with dim ceiling spotlights and a warm bedside lamp";

const FIXED_ROOM_DESCRIPTION_AR =
  "في غرفة نوم حديثة واقعية مع إضاءة سقف خافتة ومصباح سرير دافئ";

const lightingModeLabels: Record<SceneState["lightingMode"], string> = {
  "as-in-photo": "ceiling spotlights (dim) with a warm bedside lamp",
  "phone-screen": "only the phone screen glow on the face, room otherwise dark",
  "daylight-closed": "soft diffused daylight through closed dark curtains",
  "daylight-open": "bright natural daylight from the back window",
};

const lightingModeLabelsAr: Record<SceneState["lightingMode"], string> = {
  "as-in-photo": "إضاءة سقف خافتة مع مصباح سرير دافئ",
  "phone-screen": "ضوء شاشة الهاتف على الوجه، الغرفة معتمة",
  "daylight-closed": "ضوء نهار منتشر عبر الستائر الداكنة المغلقة",
  "daylight-open": "ضوء نهار طبيعي ساطع من النافذة الخلفية",
};

const identityPriorityLabels: Record<SceneState["identityPriority"], string> = {
  strict: "strict",
  balanced: "balanced",
  flexible: "flexible",
};

const identityPriorityLabelsAr: Record<SceneState["identityPriority"], string> =
  {
    strict: "قصوى",
    balanced: "متوازنة",
    flexible: "مرنة",
  };

const phonePositionLabels: Record<SceneState["phonePosition"], string> = {
  "front-of-face": "held directly in front of the face",
  "chest-level": "held at chest level",
  "above-chest": "raised above the chest",
  "side-soft": "held slightly to the side",
};

const phonePositionLabelsAr: Record<SceneState["phonePosition"], string> = {
  "front-of-face": "أمام الوجه",
  "chest-level": "على مستوى الصدر",
  "above-chest": "فوق الصدر",
  "side-soft": "جانبي بلطف",
};

const phoneHoldingArmLabels: Record<SceneState["shotType"], string> = {
  "front-selfie":
    "The arm holding the phone is extended forward with a slightly bent elbow",
  "mirror-selfie":
    "The arm holding the phone is bent at the elbow, phone at chest height",
};

const phoneHoldingArmLabelsAr: Record<SceneState["shotType"], string> = {
  "front-selfie": "الذراع الممسكة بالهاتف ممتدة للأمام مع انحناء بسيط في الكوع",
  "mirror-selfie":
    "الذراع الممسكة بالهاتف منحنية عند الكوع، الهاتف على مستوى الصدر",
};

const shotTypes: Record<SceneState["shotType"], string> = {
  "front-selfie": "سيلفي بالكاميرا الأمامية",
  "mirror-selfie": "سيلفي أمام المرآة",
};

const englishShotTypes: Record<SceneState["shotType"], string> = {
  "front-selfie": "Front-camera selfie",
  "mirror-selfie": "Mirror selfie",
};

const cameraDistances: Record<SceneState["cameraDistance"], string> = {
  close: "قريبة من الوجه",
  "arm-length": "عند طول الذراع",
  extended: "عند امتداد الذراع",
};

const englishCameraDistances: Record<SceneState["cameraDistance"], string> = {
  close: "Close to the face",
  "arm-length": "At arm's length",
  extended: "With an extended arm",
};

const cameraAngles: Record<SceneState["cameraAngle"], string> = {
  "eye-level": "بمستوى العين",
  "slightly-above": "أعلى من مستوى العين قليلاً",
  "slightly-below": "أسفل من مستوى العين قليلاً",
};

const englishCameraAngles: Record<SceneState["cameraAngle"], string> = {
  "eye-level": "eye level",
  "slightly-above": "slightly above eye level",
  "slightly-below": "slightly below eye level",
};

const clothingTopLabels: Record<SceneState["clothingTop"], string> = {
  "t-shirt": "تي شيرت",
  shirt: "قميص",
  hoodie: "هودي",
  "pajama-top": "بلوزة نوم",
  sweater: "كنزة",
  "tank-top": "قميص بلا أكمام",
};

const englishClothingTops: Record<SceneState["clothingTop"], string> = {
  "t-shirt": "T-shirt",
  shirt: "shirt",
  hoodie: "hoodie",
  "pajama-top": "pajama top",
  sweater: "sweater",
  "tank-top": "tank top",
};

const clothingBottomLabels: Record<SceneState["clothingBottom"], string> = {
  jeans: "بنطال جينز",
  shorts: "شورت",
  "pajama-pants": "بنطال نوم",
  sweatpants: "بنطال رياضي",
  "none-visible": "القطعة السفلية خارج الإطار",
};

const englishClothingBottoms: Record<SceneState["clothingBottom"], string> = {
  jeans: "jeans",
  shorts: "shorts",
  "pajama-pants": "pajama pants",
  sweatpants: "sweatpants",
  "none-visible": "the lower garment outside the frame",
};

const clothingMaterialLabels: Record<SceneState["clothingMaterial"], string> = {
  cotton: "قطن",
  denim: "دنيم",
  wool: "صوف",
  polyester: "بوليستر",
  linen: "كتان",
};

const englishClothingMaterials: Record<SceneState["clothingMaterial"], string> =
  {
    cotton: "cotton",
    denim: "denim",
    wool: "wool",
    polyester: "polyester",
    linen: "linen",
  };

const clothingColorLabels: Record<SceneState["clothingColor"], string> = {
  neutral: "محايدة",
  dark: "داكنة",
  light: "فاتحة",
  "earth-tone": "ترابية",
  pastel: "باستيل",
};

const englishClothingColors: Record<SceneState["clothingColor"], string> = {
  neutral: "neutral",
  dark: "dark",
  light: "light",
  "earth-tone": "earth",
  pastel: "pastel",
};

const hairStyleLabels: Record<SceneState["hairStyle"], string> = {
  natural: "طبيعي",
  combed: "ممشط",
  "messy-light": "فوضوي قليلاً",
  "combed-back": "ممشط للخلف بانتظام",
  "side-part": "مفرق جانبياً",
};

const englishHairStyles: Record<SceneState["hairStyle"], string> = {
  natural: "natural",
  combed: "combed",
  "messy-light": "slightly tousled",
  "combed-back": "combed back neatly",
  "side-part": "side-parted",
};

const hairLengthLabels: Record<SceneState["hairLength"], string> = {
  short: "قصير",
  medium: "متوسط",
  long: "طويل",
};

const englishHairLengths: Record<SceneState["hairLength"], string> = {
  short: "short",
  medium: "medium-length",
  long: "long",
};

const hairTextureLabels: Record<SceneState["hairTexture"], string> = {
  straight: "أملس",
  wavy: "مموج",
  curly: "مجعد",
};

const englishHairTextures: Record<SceneState["hairTexture"], string> = {
  straight: "straight",
  wavy: "wavy",
  curly: "curly",
};

const poseTypeLabels: Record<SceneState["poseType"], string> = {
  standing: "واقف",
  "sitting-bed": "جالس على السرير",
  "sitting-chair": "جالس على كرسي",
  "lying-bed": "مستلقٍ على السرير",
  "standing-window": "واقف قرب النافذة",
};

const englishPoseTypes: Record<SceneState["poseType"], string> = {
  standing: "standing",
  "sitting-bed": "sitting on the bed",
  "sitting-chair": "sitting on a chair",
  "lying-bed": "lying on the bed",
  "standing-window": "standing near the window",
};

const headDirectionLabels: Record<SceneState["headDirection"], string> = {
  forward: "للأمام",
  "slightly-left": "لليسار قليلاً",
  "slightly-right": "لليمين قليلاً",
  down: "للأسفل",
  "up-soft": "للأعلى قليلاً",
};

const englishHeadDirections: Record<SceneState["headDirection"], string> = {
  forward: "facing forward",
  "slightly-left": "turned slightly left",
  "slightly-right": "turned slightly right",
  down: "angled down",
  "up-soft": "angled gently upward",
};

const shoulderPositionLabels: Record<SceneState["shoulderPosition"], string> = {
  relaxed: "مسترخيان",
  "one-raised": "أحدهما مرتفع قليلاً",
  "both-back": "للخلف",
};

const englishShoulderPositions: Record<SceneState["shoulderPosition"], string> =
  {
    relaxed: "relaxed",
    "one-raised": "one slightly raised",
    "both-back": "drawn back",
  };

const backPostureLabels: Record<SceneState["backPosture"], string> = {
  straight: "مستقيم",
  relaxed: "مسترخٍ",
  "slightly-leaning": "مائل قليلاً",
};

const englishBackPostures: Record<SceneState["backPosture"], string> = {
  straight: "straight",
  relaxed: "relaxed",
  "slightly-leaning": "slightly leaning",
};

const faceExpressionLabels: Record<SceneState["faceExpression"], string> = {
  neutral: "محايد طبيعي",
  "soft-smile": "ابتسامة خفيفة",
  "closed-smile": "ابتسامة مغلقة",
  "calm-focus": "تركيز هادئ",
  "side-glance": "نظرة جانبية",
  thinking: "تفكير",
  sleepy: "نعاس خفيف",
  "light-laugh": "ضحكة خفيفة",
};

const englishFaceExpressions: Record<SceneState["faceExpression"], string> = {
  neutral: "neutral",
  "soft-smile": "a soft smile",
  "closed-smile": "a closed-mouth smile",
  "calm-focus": "calm focus",
  "side-glance": "a side glance",
  thinking: "thoughtful",
  sleepy: "slightly sleepy",
  "light-laugh": "a light laugh",
};

const eyeDirectionLabels: Record<SceneState["eyeDirection"], string> = {
  camera: "نحو الكاميرا",
  mirror: "نحو المرآة",
  "away-soft": "بعيداً بلطف",
  "down-soft": "للأسفل بلطف",
};

const englishEyeDirections: Record<SceneState["eyeDirection"], string> = {
  camera: "at the camera",
  mirror: "at the mirror",
  "away-soft": "softly away",
  "down-soft": "softly down",
};

const mouthStateLabels: Record<SceneState["mouthState"], string> = {
  closed: "مغلق",
  "slightly-open": "مفتوح قليلاً",
  "smile-closed": "في ابتسامة مغلقة",
  "smile-open-light": "في ابتسامة مفتوحة خفيفة",
};

const englishMouthStates: Record<SceneState["mouthState"], string> = {
  closed: "closed",
  "slightly-open": "slightly open",
  "smile-closed": "in a closed smile",
  "smile-open-light": "in a light open smile",
};

const freeHandPositionLabels: Record<SceneState["freeHandPosition"], string> = {
  "at-side": "بجانب الجسم",
  "on-hair": "على الشعر",
  "holding-cup": "تحمل كوباً",
  "touching-chin": "تلمس الذقن",
  "in-pocket": "في الجيب",
  "on-bed": "على السرير",
  "on-chest": "على الصدر",
  "on-keyboard": "على لوحة المفاتيح",
  "holding-cloth": "تحمل قطعة قماش",
  "holding-phone": "تحمل الهاتف",
};

const englishFreeHandPositions: Record<SceneState["freeHandPosition"], string> =
  {
    "at-side": "at the side",
    "on-hair": "on the hair",
    "holding-cup": "holding a cup",
    "touching-chin": "touching the chin",
    "in-pocket": "in a pocket",
    "on-bed": "on the bed",
    "on-chest": "on the chest",
    "on-keyboard": "on the keyboard",
    "holding-cloth": "holding a piece of cloth",
    "holding-phone": "holding a phone",
  };

const handFingersStateLabels: Record<SceneState["handFingersState"], string> = {
  relaxed: "مسترخية",
  "slightly-curled": "ملتفة قليلاً",
  "gripping-soft": "قابضة برفق",
};

const englishHandFingersStates: Record<SceneState["handFingersState"], string> =
  {
    relaxed: "relaxed",
    "slightly-curled": "slightly curled",
    "gripping-soft": "gently gripping",
  };

const handVisibilityLabels: Record<SceneState["handVisibility"], string> = {
  "fully-visible": "ظاهرة بالكامل في الإطار",
  "partially-visible": "ظاهرة جزئياً في الإطار",
  "off-frame": "خارج الإطار",
};

const englishHandVisibilities: Record<SceneState["handVisibility"], string> = {
  "fully-visible": "fully visible in frame",
  "partially-visible": "partially visible in frame",
  "off-frame": "off-frame",
};

function effectiveMouthState(state: SceneState): SceneState["mouthState"] {
  if (
    state.faceExpression === "sleepy" &&
    state.mouthState === "smile-open-light"
  ) {
    return "closed";
  }
  if (state.faceExpression === "closed-smile") return "smile-closed";
  if (
    state.faceExpression === "light-laugh" &&
    (state.mouthState === "closed" || state.mouthState === "smile-closed")
  ) {
    return "slightly-open";
  }
  return state.mouthState;
}

function effectiveEyeDirection(state: SceneState): SceneState["eyeDirection"] {
  return state.faceExpression === "side-glance" &&
    state.eyeDirection === "camera"
    ? "away-soft"
    : state.eyeDirection;
}

function englishHairDescription(state: SceneState): string {
  if (state.hairStyle === "combed-back") {
    return `${englishHairLengths[state.hairLength]} ${englishHairTextures[state.hairTexture]} hair, combed back neatly`;
  }
  return `${englishHairLengths[state.hairLength]} ${englishHairTextures[state.hairTexture]} ${englishHairStyles[state.hairStyle]} hair`;
}

function englishScenarioDescription(state: SceneState): string {
  if (state.scenario === "adjusting-clothing") {
    return " Fully dressed, the subject checks their outfit before going out while smoothing their hair in the mirror.";
  }
  if (state.scenario === "choosing-clothes") {
    return " The subject chooses clothes from the bedroom closet while holding a garment.";
  }
  return "";
}

function arabicScenarioDescription(state: SceneState): string {
  if (state.scenario === "adjusting-clothing") {
    return " الشخص بملابس كاملة محتشمة يفحص مظهره قبل الخروج ويرتب شعره أمام المرآة.";
  }
  if (state.scenario === "choosing-clothes") {
    return " يختار قطعة ملابس من خزانة الغرفة وهو ممسك بها.";
  }
  return "";
}

function englishHandDescription(state: SceneState): string {
  if (state.handVisibility === "off-frame") {
    return "The free hand is off-frame.";
  }
  return `The free hand is ${englishFreeHandPositions[state.freeHandPosition]}, fingers ${englishHandFingersStates[state.handFingersState]}, ${englishHandVisibilities[state.handVisibility]}.`;
}

function arabicHandDescription(state: SceneState): string {
  if (state.handVisibility === "off-frame") {
    return "اليد الحرة خارج الإطار.";
  }
  return `اليد الحرة ${freeHandPositionLabels[state.freeHandPosition]}، والأصابع ${handFingersStateLabels[state.handFingersState]}، واليد ${handVisibilityLabels[state.handVisibility]}.`;
}

export function buildPromptEnglish(state: SceneState): string {
  const notes = state.identityNotes.trim();
  const identityNotesDescription = notes
    ? ` Additional identity notes: ${notes}.`
    : "";

  return `Preserve the subject's identity from the reference image with ${identityPriorityLabels[state.identityPriority]} priority.${identityNotesDescription} ${englishShotTypes[state.shotType]}, the subject is ${englishPoseTypes[state.poseType]}, head ${englishHeadDirections[state.headDirection]}, shoulders ${englishShoulderPositions[state.shoulderPosition]}, back ${englishBackPostures[state.backPosture]}.${englishScenarioDescription(state)} Facial expression: ${englishFaceExpressions[state.faceExpression]}, eyes ${englishEyeDirections[effectiveEyeDirection(state)]}, mouth ${englishMouthStates[effectiveMouthState(state)]}. Hair: ${englishHairDescription(state)}. Wearing: a ${englishClothingMaterials[state.clothingMaterial]} ${englishClothingTops[state.clothingTop]} in ${englishClothingColors[state.clothingColor]} tones, and ${englishClothingBottoms[state.clothingBottom]}. ${englishHandDescription(state)} The phone is ${phonePositionLabels[state.phonePosition]}. ${phoneHoldingArmLabels[state.shotType]}. ${englishCameraDistances[state.cameraDistance]}, camera at ${englishCameraAngles[state.cameraAngle]}. ${FIXED_ROOM_DESCRIPTION_EN}. Lighting: ${lightingModeLabels[state.lightingMode]}. Realistic smartphone photography, natural skin texture, balanced dynamic range.`;
}

export function buildPromptArabic(state: SceneState): string {
  const notes = state.identityNotes.trim();
  const identityNotesDescription = notes
    ? ` ملاحظات إضافية عن الهوية: ${notes}.`
    : "";

  return `حافظ على هوية الشخص من الصورة المرجعية بأولوية ${identityPriorityLabelsAr[state.identityPriority]}.${identityNotesDescription} ${shotTypes[state.shotType]}، الشخص ${poseTypeLabels[state.poseType]}، رأسه ${headDirectionLabels[state.headDirection]}، وكتفاه ${shoulderPositionLabels[state.shoulderPosition]}، وظهره ${backPostureLabels[state.backPosture]}.${arabicScenarioDescription(state)} تعبير الوجه: ${faceExpressionLabels[state.faceExpression]}، والعينان ${eyeDirectionLabels[effectiveEyeDirection(state)]}، والفم ${mouthStateLabels[effectiveMouthState(state)]}. الشعر: ${hairLengthLabels[state.hairLength]} ${hairTextureLabels[state.hairTexture]} ${hairStyleLabels[state.hairStyle]}. الملابس: ${clothingTopLabels[state.clothingTop]} من ${clothingMaterialLabels[state.clothingMaterial]} بدرجات ${clothingColorLabels[state.clothingColor]}، و${clothingBottomLabels[state.clothingBottom]}. ${arabicHandDescription(state)} الهاتف ${phonePositionLabelsAr[state.phonePosition]}. ${phoneHoldingArmLabelsAr[state.shotType]}. الكاميرا ${cameraDistances[state.cameraDistance]}، عند ${cameraAngles[state.cameraAngle]}. ${FIXED_ROOM_DESCRIPTION_AR}. الإضاءة: ${lightingModeLabelsAr[state.lightingMode]}. تصوير هاتف ذكي واقعي، ملمس بشرة طبيعي، ونطاق ديناميكي متوازن.`;
}

export function buildNegativePrompt(state: SceneState): string {
  const constraints = [
    "no identity change",
    "no face alteration",
    "no AI-looking artifacts",
    "no watermark",
    "no text artifacts",
    "no distorted face; no waxy skin; no plastic skin",
    "no unrealistic lighting; no excessive HDR",
    "no warped furniture",
  ];

  if (state.handVisibility === "fully-visible") {
    constraints.push("no extra fingers; no malformed hands; no fused fingers");
  } else if (state.handVisibility === "partially-visible") {
    constraints.push("no malformed visible fingers");
  }

  if (state.shotType === "mirror-selfie") {
    constraints.push("no incorrect reflections; no mirrored text");
  }

  if (state.poseType === "lying-bed") {
    constraints.push("no elongated arms", "no distorted shoulders");
  }

  if (state.scenario === "adjusting-clothing") {
    constraints.push(
      "no nudity; no partially undressed subject; no suggestive pose; no exposed skin beyond face and hands",
    );
  }

  return constraints.join(", ");
}
