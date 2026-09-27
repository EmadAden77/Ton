import type { SceneState } from "./types";

export const FIXED_ROOM_DESCRIPTION_EN =
  "in the fixed realistic modern bedroom: a dark tufted-headboard bed on the left, a bedside table with a lamp, a split AC above the bed, dark curtains at the back window, a glass-door wardrobe on the right, a wooden dresser, a beige rug, grey tiled floor, and recessed ceiling spotlights";

export const FIXED_ROOM_DESCRIPTION_AR =
  "في غرفة النوم الحديثة الواقعية الثابتة: سرير بلوح رأس داكن مبطن على اليسار، وطاولة جانبية مع مصباح، ومكيف سبليت فوق السرير، وستائر داكنة عند النافذة الخلفية، وخزانة بأبواب زجاجية على اليمين، وخزانة أدراج خشبية، وسجادة بيج، وأرضية بلاط رمادية، وسبوتات سقف غائرة";

export const lightingModeLabels: Record<SceneState["lightingMode"], string> = {
  "as-in-photo":
    "dim recessed ceiling spotlights plus a warm bedside lamp, with natural falloff and mixed practical-light shadows",
  "phone-screen":
    "the phone screen is the only active light source on the face; the ceiling spotlights and bedside lamp are off, the room stays very dark, and the light falls off quickly into natural shadow noise",
  "daylight-closed":
    "soft diffused daylight passing through the closed dark curtains; indoor practical lights are off",
  "daylight-open":
    "natural daylight entering through the open back-window curtains; indoor practical lights are off, with realistic window-to-room contrast",
};

export const lightingModeLabelsAr: Record<SceneState["lightingMode"], string> =
  {
    "as-in-photo":
      "سبوتات سقف غائرة وخافتة مع مصباح سرير دافئ، بتناقص ضوئي طبيعي وظلال ناتجة عن مصادر الإضاءة العملية المختلطة",
    "phone-screen":
      "شاشة الهاتف هي مصدر الضوء النشط الوحيد على الوجه؛ سبوتات السقف ومصباح السرير مطفأة، والغرفة شديدة العتمة مع تناقص سريع للضوء وضجيج طبيعي في الظلال",
    "daylight-closed":
      "ضوء نهار ناعم ومنتشر يمر عبر الستائر الداكنة المغلقة، مع إطفاء الإضاءة الداخلية العملية",
    "daylight-open":
      "ضوء نهار طبيعي يدخل عبر ستائر النافذة الخلفية المفتوحة، مع إطفاء الإضاءة الداخلية والحفاظ على تباين واقعي بين النافذة والغرفة",
  };

export const identityPriorityLabels: Record<
  SceneState["identityPriority"],
  string
> = {
  strict: "strict",
  balanced: "balanced",
  flexible: "flexible",
};

export const identityPriorityLabelsAr: Record<
  SceneState["identityPriority"],
  string
> = {
  strict: "قصوى",
  balanced: "متوازنة",
  flexible: "مرنة",
};

export const phonePositionLabels: Record<SceneState["phonePosition"], string> =
  {
    "front-of-face": "held directly in front of the face",
    "chest-level": "held at chest level",
    "above-chest": "raised above the chest",
    "side-soft": "held slightly to the side",
  };

export const phonePositionLabelsAr: Record<
  SceneState["phonePosition"],
  string
> = {
  "front-of-face": "أمام الوجه",
  "chest-level": "على مستوى الصدر",
  "above-chest": "فوق الصدر",
  "side-soft": "جانبي بلطف",
};

export const shotTypes: Record<SceneState["shotType"], string> = {
  "front-selfie": "سيلفي بالكاميرا الأمامية",
  "mirror-selfie": "سيلفي أمام المرآة",
};

export const englishShotTypes: Record<SceneState["shotType"], string> = {
  "front-selfie": "Front-camera selfie",
  "mirror-selfie": "Mirror selfie",
};

export const cameraDistances: Record<SceneState["cameraDistance"], string> = {
  close: "قريبة من الوجه",
  "arm-length": "عند طول الذراع",
  extended: "عند امتداد الذراع",
};

export const englishCameraDistances: Record<
  SceneState["cameraDistance"],
  string
> = {
  close: "Close to the face",
  "arm-length": "At arm's length",
  extended: "With an extended arm",
};

export const cameraAngles: Record<SceneState["cameraAngle"], string> = {
  "eye-level": "بمستوى العين",
  "slightly-above": "أعلى من مستوى العين قليلاً",
  "slightly-below": "أسفل من مستوى العين قليلاً",
};

export const englishCameraAngles: Record<SceneState["cameraAngle"], string> = {
  "eye-level": "eye level",
  "slightly-above": "slightly above eye level",
  "slightly-below": "slightly below eye level",
};

export const clothingTopLabels: Record<SceneState["clothingTop"], string> = {
  "t-shirt": "تي شيرت",
  shirt: "قميص",
  hoodie: "هودي",
  "pajama-top": "بلوزة نوم",
  sweater: "كنزة",
  "tank-top": "قميص بلا أكمام",
};

export const englishClothingTops: Record<SceneState["clothingTop"], string> = {
  "t-shirt": "T-shirt",
  shirt: "shirt",
  hoodie: "hoodie",
  "pajama-top": "pajama top",
  sweater: "sweater",
  "tank-top": "tank top",
};

export const clothingBottomLabels: Record<
  SceneState["clothingBottom"],
  string
> = {
  jeans: "بنطال جينز",
  shorts: "شورت",
  "pajama-pants": "بنطال نوم",
  sweatpants: "بنطال رياضي",
  "none-visible": "القطعة السفلية خارج الإطار",
};

export const englishClothingBottoms: Record<
  SceneState["clothingBottom"],
  string
> = {
  jeans: "jeans",
  shorts: "shorts",
  "pajama-pants": "pajama pants",
  sweatpants: "sweatpants",
  "none-visible": "the lower garment outside the frame",
};

export const clothingMaterialLabels: Record<
  SceneState["clothingMaterial"],
  string
> = {
  cotton: "قطن",
  denim: "دنيم",
  wool: "صوف",
  polyester: "بوليستر",
  linen: "كتان",
};

export const englishClothingMaterials: Record<
  SceneState["clothingMaterial"],
  string
> = {
  cotton: "cotton",
  denim: "denim",
  wool: "wool",
  polyester: "polyester",
  linen: "linen",
};

export const clothingColorLabels: Record<SceneState["clothingColor"], string> =
  {
    neutral: "محايدة",
    dark: "داكنة",
    light: "فاتحة",
    "earth-tone": "ترابية",
    pastel: "باستيل",
  };

export const englishClothingColors: Record<
  SceneState["clothingColor"],
  string
> = {
  neutral: "neutral",
  dark: "dark",
  light: "light",
  "earth-tone": "earth",
  pastel: "pastel",
};

export const hairStyleLabels: Record<SceneState["hairStyle"], string> = {
  natural: "طبيعي",
  combed: "ممشط",
  "messy-light": "فوضوي قليلاً",
  "combed-back": "ممشط للخلف بانتظام",
  "side-part": "مفرق جانبياً",
};

export const englishHairStyles: Record<SceneState["hairStyle"], string> = {
  natural: "natural",
  combed: "combed",
  "messy-light": "slightly tousled",
  "combed-back": "combed back neatly",
  "side-part": "side-parted",
};

export const hairLengthLabels: Record<SceneState["hairLength"], string> = {
  short: "قصير",
  medium: "متوسط",
  long: "طويل",
};

export const englishHairLengths: Record<SceneState["hairLength"], string> = {
  short: "short",
  medium: "medium-length",
  long: "long",
};

export const hairTextureLabels: Record<SceneState["hairTexture"], string> = {
  straight: "أملس",
  wavy: "مموج",
  curly: "مجعد",
};

export const englishHairTextures: Record<SceneState["hairTexture"], string> = {
  straight: "straight",
  wavy: "wavy",
  curly: "curly",
};

export const poseTypeLabels: Record<SceneState["poseType"], string> = {
  standing: "واقف",
  "sitting-bed": "جالس على السرير",
  "sitting-chair": "جالس على كرسي",
  "lying-bed": "مستلقٍ على السرير",
  "standing-window": "واقف قرب النافذة",
};

export const englishPoseTypes: Record<SceneState["poseType"], string> = {
  standing: "standing",
  "sitting-bed": "sitting on the bed",
  "sitting-chair": "sitting on a chair",
  "lying-bed": "lying on the bed",
  "standing-window": "standing near the window",
};

export const headDirectionLabels: Record<SceneState["headDirection"], string> =
  {
    forward: "للأمام",
    "slightly-left": "لليسار قليلاً",
    "slightly-right": "لليمين قليلاً",
    down: "للأسفل",
    "up-soft": "للأعلى قليلاً",
  };

export const englishHeadDirections: Record<
  SceneState["headDirection"],
  string
> = {
  forward: "facing forward",
  "slightly-left": "turned slightly left",
  "slightly-right": "turned slightly right",
  down: "angled down",
  "up-soft": "angled gently upward",
};

export const shoulderPositionLabels: Record<
  SceneState["shoulderPosition"],
  string
> = {
  relaxed: "مسترخيان",
  "one-raised": "أحدهما مرتفع قليلاً",
  "both-back": "للخلف",
};

export const englishShoulderPositions: Record<
  SceneState["shoulderPosition"],
  string
> = {
  relaxed: "relaxed",
  "one-raised": "one slightly raised",
  "both-back": "drawn back",
};

export const backPostureLabels: Record<SceneState["backPosture"], string> = {
  straight: "مستقيم",
  relaxed: "مسترخٍ",
  "slightly-leaning": "مائل قليلاً",
};

export const englishBackPostures: Record<SceneState["backPosture"], string> = {
  straight: "straight",
  relaxed: "relaxed",
  "slightly-leaning": "slightly leaning",
};

export const faceExpressionLabels: Record<
  SceneState["faceExpression"],
  string
> = {
  neutral: "محايد طبيعي",
  "soft-smile": "ابتسامة خفيفة",
  "closed-smile": "ابتسامة مغلقة",
  "calm-focus": "تركيز هادئ",
  "side-glance": "نظرة جانبية",
  thinking: "تفكير",
  sleepy: "نعاس خفيف",
  "light-laugh": "ضحكة خفيفة",
};

export const englishFaceExpressions: Record<
  SceneState["faceExpression"],
  string
> = {
  neutral: "neutral",
  "soft-smile": "a soft smile",
  "closed-smile": "a closed-mouth smile",
  "calm-focus": "calm focus",
  "side-glance": "a side glance",
  thinking: "thoughtful",
  sleepy: "slightly sleepy",
  "light-laugh": "a light laugh",
};

export const eyeDirectionLabels: Record<SceneState["eyeDirection"], string> = {
  camera: "نحو الكاميرا",
  mirror: "نحو المرآة",
  "away-soft": "بعيداً بلطف",
  "down-soft": "للأسفل بلطف",
};

export const englishEyeDirections: Record<SceneState["eyeDirection"], string> =
  {
    camera: "at the camera",
    mirror: "at the mirror",
    "away-soft": "softly away",
    "down-soft": "softly down",
  };

export const mouthStateLabels: Record<SceneState["mouthState"], string> = {
  closed: "مغلق",
  "slightly-open": "مفتوح قليلاً",
  "smile-closed": "في ابتسامة مغلقة",
  "smile-open-light": "في ابتسامة مفتوحة خفيفة",
};

export const englishMouthStates: Record<SceneState["mouthState"], string> = {
  closed: "closed",
  "slightly-open": "slightly open",
  "smile-closed": "in a closed smile",
  "smile-open-light": "in a light open smile",
};

export const freeHandPositionLabels: Record<
  SceneState["freeHandPosition"],
  string
> = {
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

export const englishFreeHandPositions: Record<
  SceneState["freeHandPosition"],
  string
> = {
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

export const handFingersStateLabels: Record<
  SceneState["handFingersState"],
  string
> = {
  relaxed: "مسترخية",
  "slightly-curled": "ملتفة قليلاً",
  "gripping-soft": "قابضة برفق",
};

export const englishHandFingersStates: Record<
  SceneState["handFingersState"],
  string
> = {
  relaxed: "relaxed",
  "slightly-curled": "slightly curled",
  "gripping-soft": "gently gripping",
};

export const handVisibilityLabels: Record<
  SceneState["handVisibility"],
  string
> = {
  "fully-visible": "ظاهرة بالكامل في الإطار",
  "partially-visible": "ظاهرة جزئياً في الإطار",
  "off-frame": "خارج الإطار",
};

export const englishHandVisibilities: Record<
  SceneState["handVisibility"],
  string
> = {
  "fully-visible": "fully visible in frame",
  "partially-visible": "partially visible in frame",
  "off-frame": "off-frame",
};
