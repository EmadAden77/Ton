import type { SceneState } from "./types";

export type MicroPoseField =
  | "legConfiguration"
  | "torsoLean"
  | "pelvisOrientation"
  | "weightDistribution";

export type MicroPoseRule = {
  allowed?: readonly string[];
  lockedTo?: string;
  reason?: string;
  lockReason?: string;
};

export const MICRO_POSE_VALUES: Record<MicroPoseField, readonly string[]> = {
  legConfiguration: [
    "neutral",
    "staggered",
    "one-knee-bent",
    "feet-grounded",
    "ankles-crossed",
    "legs-extended",
    "cross-legged",
  ],
  torsoLean: [
    "neutral",
    "slight-forward",
    "slight-back",
    "slight-left",
    "slight-right",
  ],
  pelvisOrientation: ["square", "slightly-left", "slightly-right"],
  weightDistribution: ["balanced", "left-biased", "right-biased", "supported"],
};

export const legConfigurationOptions = [
  { value: "neutral", label: "طبيعية حسب الوضعية (Neutral)" },
  { value: "staggered", label: "قدم أمام الأخرى قليلاً (Staggered)" },
  { value: "one-knee-bent", label: "ركبة واحدة مثنية بخفة (One knee bent)" },
  { value: "feet-grounded", label: "القدمان على الأرض (Feet grounded)" },
  { value: "ankles-crossed", label: "الكاحلان متقاطعان (Ankles crossed)" },
  { value: "legs-extended", label: "الساقان ممتدتان (Legs extended)" },
  { value: "cross-legged", label: "جلوس متربع (Cross-legged)" },
] as const;

export const torsoLeanOptions = [
  { value: "neutral", label: "محايد (Neutral)" },
  { value: "slight-forward", label: "ميل خفيف للأمام (Slight forward)" },
  { value: "slight-back", label: "ميل خفيف للخلف (Slight back)" },
  { value: "slight-left", label: "ميل خفيف لليسار (Slight left)" },
  { value: "slight-right", label: "ميل خفيف لليمين (Slight right)" },
] as const;

export const pelvisOrientationOptions = [
  { value: "square", label: "مستقيم للأمام (Square)" },
  { value: "slightly-left", label: "دوران خفيف لليسار (Slight left)" },
  { value: "slightly-right", label: "دوران خفيف لليمين (Slight right)" },
] as const;

export const weightDistributionOptions = [
  { value: "balanced", label: "متوازن (Balanced)" },
  { value: "left-biased", label: "ميل وزن لليسار (Left-biased)" },
  { value: "right-biased", label: "ميل وزن لليمين (Right-biased)" },
  { value: "supported", label: "مدعوم بسطح (Supported)" },
] as const;

const STANDING_LEGS = ["neutral", "staggered", "one-knee-bent"] as const;
const STANDING_TORSO = [
  "neutral",
  "slight-forward",
  "slight-left",
  "slight-right",
] as const;
const STANDING_WEIGHT = ["balanced", "left-biased", "right-biased"] as const;
const FREE_PELVIS = ["square", "slightly-left", "slightly-right"] as const;

const profiles: Record<
  SceneState["poseType"],
  Partial<Record<MicroPoseField, MicroPoseRule>>
> = {
  standing: {
    legConfiguration: { allowed: STANDING_LEGS },
    torsoLean: { allowed: STANDING_TORSO },
    pelvisOrientation: { allowed: FREE_PELVIS },
    weightDistribution: { allowed: STANDING_WEIGHT },
  },
  "standing-window": {
    legConfiguration: { allowed: STANDING_LEGS },
    torsoLean: { allowed: STANDING_TORSO },
    pelvisOrientation: { allowed: FREE_PELVIS },
    weightDistribution: { allowed: STANDING_WEIGHT },
  },
  "standing-wardrobe": {
    legConfiguration: { allowed: STANDING_LEGS },
    torsoLean: { allowed: STANDING_TORSO },
    pelvisOrientation: { allowed: FREE_PELVIS },
    weightDistribution: { allowed: STANDING_WEIGHT },
  },
  "leaning-dresser": {
    legConfiguration: { allowed: STANDING_LEGS },
    torsoLean: {
      allowed: ["neutral", "slight-back", "slight-left", "slight-right"],
    },
    pelvisOrientation: { allowed: FREE_PELVIS },
    weightDistribution: {
      lockedTo: "supported",
      lockReason: "الاتكاء على خزانة الأدراج يتطلب نقطة دعم فعلية مع بقاء القدمين حاملة للوزن",
    },
  },
  "sitting-chair": {
    legConfiguration: {
      allowed: ["neutral", "feet-grounded", "ankles-crossed"],
    },
    torsoLean: {
      allowed: [
        "neutral",
        "slight-forward",
        "slight-back",
        "slight-left",
        "slight-right",
      ],
    },
    pelvisOrientation: { allowed: FREE_PELVIS },
  },
  "sitting-bed": {
    legConfiguration: {
      allowed: ["neutral", "ankles-crossed", "legs-extended"],
    },
    torsoLean: {
      allowed: [
        "neutral",
        "slight-forward",
        "slight-back",
        "slight-left",
        "slight-right",
      ],
    },
    pelvisOrientation: { allowed: FREE_PELVIS },
  },
  "sitting-bed-edge": {
    legConfiguration: {
      allowed: ["neutral", "feet-grounded", "ankles-crossed"],
    },
    torsoLean: {
      allowed: [
        "neutral",
        "slight-forward",
        "slight-back",
        "slight-left",
        "slight-right",
      ],
    },
    pelvisOrientation: { allowed: FREE_PELVIS },
  },
  "sitting-bed-cross-legged": {
    legConfiguration: {
      lockedTo: "cross-legged",
      lockReason: "وضعية الجلوس المتربع تتطلب بقاء الساقين في تكوين متربع ومدعوم على المرتبة",
    },
    torsoLean: {
      allowed: ["neutral", "slight-forward", "slight-left", "slight-right"],
    },
    pelvisOrientation: { allowed: FREE_PELVIS },
  },
  "reclining-headboard": {
    legConfiguration: {
      allowed: ["neutral", "one-knee-bent", "ankles-crossed", "legs-extended"],
    },
    torsoLean: {
      lockedTo: "slight-back",
      lockReason: "الاتكاء على لوح السرير يتطلب ميل الجذع للخلف مع دعم فعلي للظهر",
    },
    pelvisOrientation: { allowed: FREE_PELVIS },
    weightDistribution: {
      lockedTo: "supported",
      lockReason: "الاتكاء على لوح السرير ينقل جزءاً من الحمل إلى المرتبة واللوح والوسائد",
    },
  },
  "lying-bed": {
    legConfiguration: {
      allowed: ["neutral", "one-knee-bent", "ankles-crossed", "legs-extended"],
    },
    torsoLean: {
      lockedTo: "neutral",
      lockReason: "الاستلقاء الكامل لا يستخدم ميل جذع قائم؛ الدعم يأتي من المرتبة",
    },
    pelvisOrientation: {
      lockedTo: "square",
      lockReason: "الاستلقاء الأساسي يحافظ على الحوض بمحاذاة آمنة لتجنب التواء غير مدعوم",
    },
    weightDistribution: {
      lockedTo: "supported",
      lockReason: "في الاستلقاء يحمل السرير وزن الجسم عبر نقاط التلامس مع المرتبة",
    },
  },
};

function genericReason(field: MicroPoseField): string {
  if (field === "legConfiguration") return "تكوين الساقين لا يناسب الوضعية الأساسية المختارة";
  if (field === "torsoLean") return "ميل الجذع لا يملك دعماً أو اتزاناً مناسباً في هذه الوضعية";
  if (field === "pelvisOrientation") return "اتجاه الحوض لا يناسب محاذاة الوضعية الحالية";
  return "توزيع الوزن لا يطابق نقاط الدعم في الوضعية الحالية";
}

export function getMicroPoseRule(
  field: MicroPoseField,
  state: SceneState,
): MicroPoseRule {
  const rule = profiles[state.poseType][field] ?? {};
  return {
    ...rule,
    reason: rule.reason ?? genericReason(field),
  };
}

const englishLegDescriptions: Record<SceneState["legConfiguration"], string> = {
  neutral: "the legs follow the base pose with relaxed joint alignment",
  staggered: "one foot sits slightly ahead of the other with both knees unlocked",
  "one-knee-bent": "one knee softens naturally while the other leg remains load-bearing or supported",
  "feet-grounded": "both feet make plausible floor contact without hovering heels",
  "ankles-crossed": "the ankles cross lightly without forcing the knees or hips into an extreme twist",
  "legs-extended": "the legs extend with relaxed knees and supported heels rather than rigid locking",
  "cross-legged": "the legs fold cross-legged with the knees and outer legs supported by the mattress",
};

const arabicLegDescriptions: Record<SceneState["legConfiguration"], string> = {
  neutral: "تتبع الساقان الوضعية الأساسية بمحاذاة مفاصل طبيعية ومسترخية",
  staggered: "تتقدم إحدى القدمين قليلاً عن الأخرى مع بقاء الركبتين غير مقفلتين",
  "one-knee-bent": "تنثني ركبة واحدة بصورة طبيعية بينما تبقى الساق الأخرى حاملة للوزن أو مدعومة",
  "feet-grounded": "تلامس القدمان الأرض بصورة منطقية من دون كعوب عائمة",
  "ankles-crossed": "يتقاطع الكاحلان بخفة من دون إجبار الركبتين أو الوركين على التواء حاد",
  "legs-extended": "تمتد الساقان مع ارتخاء الركبتين ودعم الكعبين بدلاً من القفل الجامد",
  "cross-legged": "تنثني الساقان في جلسة متربعة مع دعم الركبتين والجوانب الخارجية للساقين فوق المرتبة",
};

const englishTorsoDescriptions: Record<SceneState["torsoLean"], string> = {
  neutral: "the torso follows the base spine line without extra lean",
  "slight-forward": "the torso inclines slightly forward from the hips without craning the neck",
  "slight-back": "the torso inclines slightly backward only where the pelvis or a support surface can counterbalance it",
  "slight-left": "the torso shifts slightly left while the ribcage stays stacked over a credible support base",
  "slight-right": "the torso shifts slightly right while the ribcage stays stacked over a credible support base",
};

const arabicTorsoDescriptions: Record<SceneState["torsoLean"], string> = {
  neutral: "يتبع الجذع خط العمود الفقري الأساسي من دون ميل إضافي",
  "slight-forward": "يميل الجذع قليلاً إلى الأمام من الوركين من دون دفع الرقبة للأمام",
  "slight-back": "يميل الجذع قليلاً إلى الخلف فقط مع وجود الحوض أو سطح دعم يوازن هذا الميل",
  "slight-left": "يميل الجذع قليلاً لليسار مع بقاء القفص الصدري فوق قاعدة دعم منطقية",
  "slight-right": "يميل الجذع قليلاً لليمين مع بقاء القفص الصدري فوق قاعدة دعم منطقية",
};

const englishPelvisDescriptions: Record<SceneState["pelvisOrientation"], string> = {
  square: "the pelvis stays square to the base pose",
  "slightly-left": "the pelvis rotates subtly left without dragging the knees into an unnatural twist",
  "slightly-right": "the pelvis rotates subtly right without dragging the knees into an unnatural twist",
};

const arabicPelvisDescriptions: Record<SceneState["pelvisOrientation"], string> = {
  square: "يبقى الحوض بمحاذاة مستقيمة مع الوضعية الأساسية",
  "slightly-left": "يدور الحوض قليلاً لليسار من دون سحب الركبتين إلى التواء غير طبيعي",
  "slightly-right": "يدور الحوض قليلاً لليمين من دون سحب الركبتين إلى التواء غير طبيعي",
};

const englishWeightDescriptions: Record<SceneState["weightDistribution"], string> = {
  balanced: "body load stays balanced across the active support points",
  "left-biased": "body load shifts modestly left with compensating alignment through the pelvis and torso",
  "right-biased": "body load shifts modestly right with compensating alignment through the pelvis and torso",
  supported: "body load is visibly transferred into the real support surface instead of floating beside it",
};

const arabicWeightDescriptions: Record<SceneState["weightDistribution"], string> = {
  balanced: "يتوزع حمل الجسم بصورة متوازنة على نقاط الدعم الفعلية",
  "left-biased": "ينتقل حمل الجسم بدرجة خفيفة إلى اليسار مع تعويض طبيعي في الحوض والجذع",
  "right-biased": "ينتقل حمل الجسم بدرجة خفيفة إلى اليمين مع تعويض طبيعي في الحوض والجذع",
  supported: "ينتقل حمل الجسم بوضوح إلى سطح الدعم الحقيقي بدلاً من الظهور وكأنه يطفو بجانبه",
};

export function englishMicroPoseDescription(state: SceneState): string {
  return `Micro-pose: ${englishLegDescriptions[state.legConfiguration]}; ${englishTorsoDescriptions[state.torsoLean]}; ${englishPelvisDescriptions[state.pelvisOrientation]}; ${englishWeightDescriptions[state.weightDistribution]}.`;
}

export function arabicMicroPoseDescription(state: SceneState): string {
  return `تفاصيل الوضعية الدقيقة: ${arabicLegDescriptions[state.legConfiguration]}؛ ${arabicTorsoDescriptions[state.torsoLean]}؛ ${arabicPelvisDescriptions[state.pelvisOrientation]}؛ ${arabicWeightDescriptions[state.weightDistribution]}.`;
}

export type MicroPoseVec3 = [number, number, number];

export interface ThreeDMicroPoseTransform {
  positionOffset: MicroPoseVec3;
  rotationOffset: MicroPoseVec3;
  legHint: SceneState["legConfiguration"];
}

export function getThreeDMicroPoseTransform(
  state: SceneState,
): ThreeDMicroPoseTransform {
  const positionOffset: MicroPoseVec3 = [
    state.weightDistribution === "left-biased"
      ? -0.08
      : state.weightDistribution === "right-biased"
        ? 0.08
        : 0,
    0,
    0,
  ];

  const torsoPitch =
    state.torsoLean === "slight-forward"
      ? 0.08
      : state.torsoLean === "slight-back"
        ? -0.08
        : 0;
  const torsoRoll =
    state.torsoLean === "slight-left"
      ? 0.06
      : state.torsoLean === "slight-right"
        ? -0.06
        : 0;
  const pelvisYaw =
    state.pelvisOrientation === "slightly-left"
      ? 0.12
      : state.pelvisOrientation === "slightly-right"
        ? -0.12
        : 0;

  return {
    positionOffset,
    rotationOffset: [torsoPitch, pelvisYaw, torsoRoll],
    legHint: state.legConfiguration,
  };
}
